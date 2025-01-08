import { styled } from "@mui/material/styles";
import LabelIcon from "@mui/icons-material/Label";
import DefaultIcon from "@mui/icons-material/ViewList";
import { useEffect, useState } from "react";
import {
  DashboardMenuItem,
  MenuItemLink,
  useResourceDefinitions,
  useTranslate,
  ResourceDefinition,
} from "react-admin";
import { shallowEqual, useSelector } from "react-redux";
import CustomMenuItem from "./CustomMenuItem";
import { isEmpty } from "../../utils/helpers";

type MenuProps = {
  className: string;
  dashboardlabel: string;
  dense: boolean;
  hasDashboard: boolean;
  logout: React.ElementType;
  resources: ResourceDefinition<any>[];
  onMenuClick: () => void;
  theme: any;
};

const Main = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ theme: any; open: boolean }>(({ theme, open }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  marginTop: "0.5em",
  width: open ? 240 : 55, // Sidebar open and close width
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.only("xs")]: {
    marginTop: 0,
    marginBottom: "5em",
  },
  [theme.breakpoints.up("md")]: {
    marginTop: "1.5em",
  },
}));

const Menu = (props: MenuProps) => {
  const {
    className,
    dashboardlabel = "Dashboard",
    dense,
    hasDashboard,
    logout,
    resources: Resources,
    onMenuClick = () => null,
    ...rest
  } = props;

  const translate = useTranslate();
  const open = useSelector((state: any) => state?.admin?.sidebarOpen);
  const pathname = useSelector(
    (state: any) => state?.router?.location.pathname
  );
  console.log("pathname", pathname);

  const resources: ResourceDefinition<any>[] =
    Resources || Object.values(useResourceDefinitions());
  const hasList = (resource) => resource.hasList;
  console.log("resources", resources);

  const handleToggle = (parent) => {
    setState((prevState) => ({ [parent]: !prevState[parent] }));
  };

  const isParent = (resource) =>
    resource.options &&
    resource.options.hasOwnProperty("isMenuParent") &&
    resource.options.isMenuParent;

  const isOrphan = (resource) =>
    resource.options &&
    !resource.options.hasOwnProperty("menuParent") &&
    !resource.options.hasOwnProperty("isMenuParent");

  const isChildOfParent = (resource, parentResource) =>
    resource.options &&
    resource.options.hasOwnProperty("menuParent") &&
    resource.options.menuParent === parentResource.name;

  const geResourceName = (slug) => {
    if (!slug) return;
    let words = slug.toString().split("_");
    for (var i = 0; i < words.length; i++) {
      let word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    return words.join(" ");
  };

  const getPrimaryTextForResource = (resource) => {
    let resourcename = "";
    if (resource.options && resource.options.label)
      resourcename = resource.options.label;
    else if (resource.name) {
      resourcename = translate(`resources.${resource.name}.name`);
      if (resourcename.startsWith("resources."))
        resourcename = geResourceName(resource.name);
    }
    return resourcename;
  };

  const MenuItem = (resource) => (
    <MenuItemLink
      key={resource.name}
      to={`/${resource.name}`}
      primaryText={getPrimaryTextForResource(resource)}
      leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
      onClick={onMenuClick}
      dense={dense}
      sidebarIsOpen={open}
    />
  );

  const mapParentStack = (parentResource) => {
    return (
      <CustomMenuItem
        key={parentResource.name}
        handleToggle={() => handleToggle(parentResource.name)}
        isOpen={state[parentResource.name]}
        sidebarIsOpen={open}
        name={getPrimaryTextForResource(parentResource)}
        icon={parentResource.icon ? <parentResource.icon /> : <LabelIcon />}
        dense={dense}
      >
        {resources
          .filter(
            (resource) =>
              isChildOfParent(resource, parentResource) && hasList(resource)
          )
          .map((childResource) => MenuItem(childResource))}
      </CustomMenuItem>
    );
  };

  const mapIndependent = (independentResource) =>
    hasList(independentResource) && MenuItem(independentResource);

  const initialExpansionState = {};
  let parentActiveResName = null;

  resources.forEach((resource) => {
    if (isParent(resource)) {
      initialExpansionState[resource.name] = false;
    } else if (
      pathname?.startsWith(`/${resource.name}`) &&
      resource.options.hasOwnProperty("menuParent")
    ) {
      parentActiveResName = resource.options.menuParent;
    }
  });

  const [state, setState] = useState(initialExpansionState);

  useEffect(() => {
    const locationHashedArray = globalThis.location.hash.split("/");

    const resourceName = locationHashedArray[1] + "/" + locationHashedArray[2];

    const findedResource = resources?.find(
      (resource) => resource.name === resourceName
    );

    if (
      !isEmpty(findedResource) &&
      findedResource.options.hasOwnProperty("menuParent")
    ) {
      setState({ [findedResource.options.menuParent]: true });
    }

    if (
      globalThis.location.hash === "#/" ||
      globalThis.location.hash === "#/site-settings" ||
      globalThis.location.hash === "#/switch-to"
    ) {
      setState({});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalThis.location.hash, resources]);

  const resRenderGroup = [];

  resources.forEach((r) => {
    if (isParent(r)) resRenderGroup.push(mapParentStack(r));
    if (isOrphan(r)) resRenderGroup.push(mapIndependent(r));
  });

  return (
    <Main open={open} className={className} theme={props.theme} {...rest}>
      {hasDashboard && (
        <DashboardMenuItem
          dense={dense}
          sidebarIsOpen={open}
          primaryText={dashboardlabel}
          style={
            isEmpty(state) || state.hasOwnProperty(dashboardlabel)
              ? { color: "#008069" }
              : { color: "rgba(0, 0, 0, 0.54)" }
          }
          onClick={() => {
            onMenuClick();
            handleToggle(dashboardlabel);
          }}
        />
      )}
      {resRenderGroup}
    </Main>
  );
};

export default Menu;
