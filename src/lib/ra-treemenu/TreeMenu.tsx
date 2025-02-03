import { makeStyles } from "@mui/styles";
import LabelIcon from "@mui/icons-material/Label";
import DefaultIcon from "@mui/icons-material/ViewList";
import classnames from "classnames";
import { useState } from "react";
import {
  DashboardMenuItem,
  MenuItemLink,
  useResourceDefinitions,
  useTranslate,
  useSidebarState,
} from "react-admin";

import CustomMenuItem from "./CustomMenuItem";
import { createTheme } from "@mui/material";

interface TreeMenuProps {
  classes?: Record<string, string>;
  className?: string;
  dense?: boolean;
  hasDashboard?: boolean;
  resources: [];
  logout?: React.ReactNode;
  onMenuClick?: () => void;
  dashboardlabel?: string;
}

const Menu = (props: TreeMenuProps) => {
  const {
    className,
    dashboardlabel = "Dashboard",
    dense,
    hasDashboard,
    logout,
    resources: Resources,
    onMenuClick,
    ...rest
  } = props;

  const classes = useStyles(props);
  const translate = useTranslate();
  const [open] = useSidebarState();

  const pathname = window.location.hash;
  const resourcesDefinitions = useResourceDefinitions();
  const resources = Object.keys(resourcesDefinitions).map(
    (name) => resourcesDefinitions[name]
  );
  const hasList = (resource) => resource.hasList;

  const handleToggle = (parent) => {
    setState((state) => ({ [parent]: !state[parent] }));
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
    var words = slug.toString().split("_");
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
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
    /**
     * Created and returns the MenuItemLink object component
     * for a given resource.
     */
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

  /**
   * Mapping a "parent" entry and then all its children to the "tree" layout
   */

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

  /**
   * Mapping independent (without a parent) entries
   */
  const mapIndependent = (independentResource) =>
    hasList(independentResource) && MenuItem(independentResource);

  const initialExpansionState = {};
  let parentActiveResName = null;

  /**
   * Initialise all parents to inactive first.
   * Also find the active resource name.
   */
  resources &&
    resources.length > 0 &&
    resources.forEach((resource) => {
      if (isParent(resource)) {
        initialExpansionState[resource.name] = false;
      } else if (
        pathname.startsWith(`#/${resource.name}`) &&
        resource &&
        resource.options &&
        resource.options.hasOwnProperty("menuParent")
      ) {
        parentActiveResName = resource.options.menuParent;
      }
    });

  const [state, setState] = useState(initialExpansionState);
  const resRenderGroup = [];

  // useEffect(() => {
  //   const locationHashedArray = globalThis.location.hash.split("/");

  //   const resourceName = locationHashedArray[1] + "/" + locationHashedArray[2];

  //   const findedResource = resources?.find(
  //     (resource) => resource.name === resourceName
  //   );

  //   if (
  //     !isEmpty(findedResource) &&
  //     findedResource.options.hasOwnProperty("menuParent")
  //   ) {
  //     setState({ [findedResource.options.menuParent]: true });
  //   }

  //   if (
  //     globalThis.location.hash === "#/" ||
  //     globalThis.location.hash === "#/site-settings" ||
  //     globalThis.location.hash === "#/switch-to"
  //   ) {
  //     setState({});
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [globalThis.location.hash, resources]);

  /**
   * The final array which will hold the array
   * of resources to be rendered
   */

  /**
   * Looping over all resources and pushing the menu tree
   * for rendering in the order we find them declared in
   */
  resources &&
    resources.length > 0 &&
    resources.forEach((resource) => {
      if (isParent(resource)) resRenderGroup.push(mapParentStack(resource));
      if (isOrphan(resource)) resRenderGroup.push(mapIndependent(resource));
    });

  return (
    <div
      className={classnames(classes.main, className, {
        [classes.open]: open,
        [classes.closed]: !open,
      })}
      {...rest}
    >
      {hasDashboard && (
        <DashboardMenuItem
          onClick={onMenuClick}
          dense={dense}
          sidebarIsOpen={open}
          primaryText={dashboardlabel}
        />
      )}
      {resRenderGroup}
    </div>
  );
};
const theme = createTheme({
  spacing: 8,
});

const useStyles = makeStyles(
  () => ({
    main: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      marginTop: "0.5em",
      [theme.breakpoints.only("xs")]: {
        marginTop: 0,
        paddingBottom: "6em",
      },
      [theme.breakpoints.up("md")]: {
        marginTop: "1.5em",
      },
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    open: {
      width: 240,
    },
    closed: {
      width: 155,
    },
  }),
  { name: "RaTreeMenu" }
);

export default Menu;
