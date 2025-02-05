import { FC } from "react";
import {
  FunctionField,
  ReferenceField,
  Show,
  ShowProps,
  TextField,
} from "react-admin";

import { useDocumentTitle } from "@/hooks";
import ColumnShowLayout from "@/components/common/ColumnShowLayout";

const LocationShow: FC<ShowProps> = (props) => {
  useDocumentTitle("Arogga | Location Show");

  return (
    <Show {...props}>
      <ColumnShowLayout>
        <TextField source="l_id" label="ID" />
        <TextField source="l_division" label="Division" />
        <TextField source="l_district" label="District" />
        <TextField source="l_area" label="Area" />
        <TextField source="l_postcode" label="Postcode" />
        {/* <TextField source="l_zone" label="Zone" /> */}
        <ReferenceField
          source="l_zone_id"
          label="Zone"
          reference="v1/zone"
          link="show"
        >
          <TextField source="z_name" />
        </ReferenceField>
        <TextField source="l_courier" label="Courier" />
        <TextField source="l_lat" label="Latitude" />
        <TextField source="l_long" label="Longitude" />
        <FunctionField
          source="l_logistic_config"
          label="eCourier District"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.district
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="eCourier Thana"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.thana
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="eCourier Area"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.area
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="eCourier Postcode"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.postcode
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="eCourier Hub ID"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.hub
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="eCourier Status"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.ecourier?.status === 1
              ? "Active"
              : "Inactive"
          }
        />

        <FunctionField
          source="l_logistic_config"
          label="Pathao City ID"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.pathao?.city_id
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="Pathao Zone ID"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.pathao?.zone_id
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="Pathao Status"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.pathao?.status === 1
              ? "Active"
              : "Inactive"
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="RedX Area ID"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.redx?.area_id
          }
        />
        <FunctionField
          source="l_logistic_config"
          label="RedX Status"
          render={(record) =>
            record?.l_logistic_config &&
            JSON.parse(record?.l_logistic_config)?.redx?.status === 1
              ? "Active"
              : "Inactive"
          }
        />
      </ColumnShowLayout>
    </Show>
  );
};

export default LocationShow;
