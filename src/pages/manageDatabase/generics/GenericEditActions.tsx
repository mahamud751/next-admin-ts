import { Button } from "@mui/material";
import { FC } from "react";
import {
  ShowButton,
  TopToolbar,
  useNotify,
  usePermissions,
  useRefresh,
} from "react-admin";

interface EditActionsProps {
  data: any;
}

import { toQueryString } from "@/dataProvider/toQueryString";
import { toGoogleTranslateFromAnyData } from "@/services";
import { Status } from "@/utils/enums";
import { isJSONParsable, logger } from "@/utils/helpers";
import { httpClient } from "@/utils/http";

const GenericEditActions: FC<EditActionsProps> = ({ data }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const { permissions } = usePermissions();

  const handleReTranslate = async () => {
    const obj = {
      g_brief_description: isJSONParsable(data.g_brief_description)
        ? JSON.parse(data.g_brief_description)
        : "",
      g_overview: isJSONParsable(data.g_overview)
        ? JSON.parse(data.g_overview)
        : "",
      g_quick_tips: isJSONParsable(data.g_quick_tips)
        ? JSON.parse(data.g_quick_tips)
        : "",
      g_safety_advices: isJSONParsable(data.g_safety_advices)
        ? JSON.parse(data.g_safety_advices)
        : "",
    };

    for (let key in obj) {
      if (obj[key] === "") delete obj[key];
    }

    try {
      const translatedObj = await toGoogleTranslateFromAnyData(
        obj,
        process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY
      );

      if (!Object.keys(obj)?.length) return;

      const { json }: any = await httpClient(`/v1/generics/${data?.id}`, {
        method: "POST",
        body: toQueryString({
          g_brief_description_bn: JSON.stringify(
            translatedObj.g_brief_description
          ),
          g_overview_bn: JSON.stringify(translatedObj.g_overview),
          g_quick_tips_bn: JSON.stringify(translatedObj.g_quick_tips),
          g_safety_advices_bn: JSON.stringify(translatedObj.g_safety_advices),
        }),
      });

      if (json.status === Status.SUCCESS) {
        refresh();
        notify("Successfully re-translated!", {
          type: "success",
        });
      }
    } catch (err) {
      notify("Something went wrong, Please try again!", {
        type: "error",
      });
      logger(err);
    }
  };

  return (
    <TopToolbar>
      {permissions?.includes("superAdmin") && (
        <Button color="primary" onClick={handleReTranslate}>
          Re Translate
        </Button>
      )}
      <ShowButton record={data} />
    </TopToolbar>
  );
};

export default GenericEditActions;
