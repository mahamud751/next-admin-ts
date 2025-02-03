import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FC, memo, useEffect, useState } from "react";
import {
  AutocompleteInput,
  BooleanInput,
  Create,
  CreateProps,
  DateInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useNotify,
} from "react-admin";
import { FormSpy } from "react-final-form";

import { labTestUploadDataProvider } from "@/dataProvider";
import {
  useDebounce,
  useDocumentTitle,
  useGetStoreData,
  useRequest,
} from "@/hooks";
import { getFormattedDateString } from "@/utils/helpers";
import LoaderOrButton from "@/components/common/LoaderOrButton";
import LabPopulateUserInfo from "@/components/manageLabTest/LabPopulateUserInfo";
import CheckOrder from "@/components/manageLabTest/CheckOrder";
import LabTestAdd from "@/components/manageLabTest/LabTestAdd";
import LabTestTable from "@/components/manageLabTest/LabTestTable";
import LabTestCalculate from "@/components/manageLabTest/LabTestCalculate";

const LabOrderCreate: FC<CreateProps> = (props) => {
  useDocumentTitle("Arogga |Lab Order Create");
  const classes = useStyles();
  const notify = useNotify();

  const [formValues, setFormValues] = useState<any>({});
  const [locations, setLocations] = useState(null);
  const [subAreaId, setSubAreaId] = useState(null);
  const [hasSubArea, setHasSubArea] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [, setHasLocationField] = useState(true);
  const [currentSubArea, setCurrentSubArea] = useState(null);
  const [userData, receiveUserData] = useState(null);
  const [bookFor, setBookFor] = useState("");
  const [labTestSearchText, setLabTestSearchText] = useState("");
  const debouncedSearch = useDebounce(labTestSearchText, 500);
  const [orderedAt, setOrderedAt] = useState("");
  const [scheduleSelectDate, setScheduleSelectDate] = useState("");
  const [, setScheduleSelectTime] = useState("");

  const [orderNumberPrefix, setOrderNumberPrefix] = useState("");
  const [isHardCopyRequired, setIsDeliveryRequired] = useState(false);
  const [applyHardCopyConveyance, setApplyDeliveryConveyance] = useState(false);
  const [applyCollectionConveyance, setApplySampleCollectionConveyance] =
    useState(true);
  const data = useGetStoreData("v1/userLocations");
  console.log(data);
  const lId = data?.[formValues?.o_ul_id]?.l_id;

  const [selectedUserInfo, setSelectedUserInfo] = useState<any>({});
  const handleIsDeliveryRequiredChange = (value) => {
    if (!value) {
      setIsDeliveryRequired(false);
      setApplyDeliveryConveyance(false);
    } else {
      setIsDeliveryRequired(true);
    }
  };
  const handleApplyDeliveryFee = (value) => {
    if (!value) {
      setApplyDeliveryConveyance(false);
    } else {
      setApplyDeliveryConveyance(true);
    }
  };
  const handleApplySampleCollectionFeeChange = (value) => {
    if (!value) {
      setApplySampleCollectionConveyance(false);
    } else {
      setApplySampleCollectionConveyance(true);
    }
  };
  const customerId = userData?.u_id;
  const [selectedLabTest, setSelectedLabTest] = useState({
    id: null,
    name: "",
    regularPrice: "",
    discountPrice: "",
  });
  const [selectedLabTests, setSelectedLabTests] = useState([]);

  const { data: labTestOptions = [] } = useRequest(
    `/misc/api/v1/admin/lab-items?page=1&limit=1000&status=active&name=${debouncedSearch}&vendorUqid=${selectedUserInfo?.id}`,
    { method: "GET" },
    {
      isSuccessNotify: false,
      isPreFetching: true,
      refreshDeps: [debouncedSearch, selectedLabTests, selectedUserInfo],
    }
  );
  const handleSupplierChange = (user) => {
    setSelectedUserInfo(user);
  };

  let body;
  if (lId == null) {
    body = {
      customerUserId: customerId,

      labItems: selectedLabTests,
      applyCollectionConveyance:
        applyCollectionConveyance === false
          ? applyCollectionConveyance.toString()
          : applyCollectionConveyance,
      applyHardCopyConveyance:
        applyHardCopyConveyance === false
          ? applyHardCopyConveyance.toString()
          : applyHardCopyConveyance,
      location: {
        division: formValues?.userLocation?.division,
        district: formValues?.userLocation?.district,
        area: formValues?.userLocation?.area,
      },
    };
  } else {
    body = {
      customerUserId: customerId,

      locationId: lId,
      labItems: selectedLabTests,
      applyCollectionConveyance:
        applyCollectionConveyance === false
          ? applyCollectionConveyance.toString()
          : applyCollectionConveyance,
      applyHardCopyConveyance:
        applyHardCopyConveyance === false
          ? applyHardCopyConveyance.toString()
          : applyHardCopyConveyance,
    };
  }
  const {
    data: calculate,
    isSuccess,
    isLoading,
    refetch,
  } = useRequest(
    `/lab-order/api/v1/admin/orders/calculation`,
    {
      method: "POST",
      body: {
        ...body,
        vendorUqid: selectedUserInfo?.id,
      },
    },
    {
      isSuccessNotify: false,
    }
  );
  const [shouldIncludeRefOrderUqid] = useState(false);
  const { data: order, refetch: handleOrder } = useRequest(
    `/lab-order/api/v1/admin/orders/n?customerUserId=${customerId}&orderedAt=${orderedAt}&orderNumberPrefix=${orderNumberPrefix}`,
    {
      method: "GET",
    },
    {
      isSuccessNotify: false,
    }
  );
  useEffect(() => {
    if (order?.isHardCopyRequired === true) {
      setIsDeliveryRequired(true);
      // setApplyDeliveryConveyance(true);
    } else if (order?.isHardCopyRequired === false) {
      setIsDeliveryRequired(false);
      // setApplyDeliveryConveyance(false);
    } else if (isHardCopyRequired === null) {
      setIsDeliveryRequired(false);
    }
  }, [order, isHardCopyRequired]);

  const { data: scheduleDate } = useRequest(
    "/lab-order/api/v1/shared/schedule-dates",
    {},
    { isBaseUrl: true, isPreFetching: true, isSuccessNotify: false }
  );

  const mainTimes = scheduleDate?.find(
    (item) => item?.title?.en === scheduleSelectDate
  );

  const onSave = async (data) => {
    const formattedLabItems = selectedLabTests.map((labTest) => ({
      labItemUqid: labTest.labItemUqid,
      patientCount: labTest.patientCount,
    }));
    const payload = {
      labItems: formattedLabItems,
      scheduleDate: data.scheduleDate,
      scheduleTimeUqid: data.scheduleTimeUqid,
      isHardCopyRequired:
        data.isHardCopyRequired === false
          ? data?.isHardCopyRequired.toString()
          : data?.isHardCopyRequired,
      additionalNotes: data.additionalNotes,
      promoCode: null,
      subtotalAmount: calculate.subtotalAmount,
      priceDiscount: calculate.discountAmount,
      promoDiscount: calculate.promoDiscount,
      discountAmount: calculate.discountAmount,
      cash: calculate.cash,
      roundingOff: calculate.roundingOff,
      collectionConveyance: calculate.collectionConveyance,
      hardCopyConveyance: calculate.hardCopyConveyance,
      totalAmount: calculate.totalAmount,
      labMaterialCharge: calculate.labMaterialCharge,
      paymentMethod: data.paymentMethod,
      applyCollectionConveyance:
        data.applyCollectionConveyance === false
          ? data.applyCollectionConveyance.toString()
          : data.applyCollectionConveyance,
      applyHardCopyConveyance:
        data.applyHardCopyConveyance === false
          ? data?.applyHardCopyConveyance.toString()
          : data?.applyHardCopyConveyance,
      vendorUqid: selectedUserInfo?.id,
    };
    let basePayload = {
      customerUserId: customerId,
      ...payload,
    };

    if (userData?.o_ul_id !== null && lId !== undefined) {
      basePayload = {
        ...basePayload,
        //@ts-ignore
        userLocationId: userData?.o_ul_id,
      };
    } else if (userData?.o_ul_id === null || lId === undefined) {
      basePayload = {
        ...basePayload,
        //@ts-ignore
        userLocation: {
          type: data.userLocation.type,
          name: data.u_name,
          address: data.userLocation.address,
          isDefault: data.userLocation.isDefault,
          division: data.userLocation.division,
          district: data.userLocation.district,
          area: data.userLocation.area,
          mobileNumber: data.userLocation.mobileNumber,
          ...(subAreaId?.sa_id && {
            subareaId: subAreaId.sa_id,
          }),
        },
      };
    }
    const formattedPayload =
      shouldIncludeRefOrderUqid === true
        ? {
            ...basePayload,
            refOrderUqid: order?.id,
            userLocationId: order?.userLocation?.locationId,
          }
        : basePayload;

    try {
      await labTestUploadDataProvider.create("lab-order/api/v1/admin/orders", {
        data: formattedPayload,
      });
      props.history.push("/lab-order/api/v1/admin/orders");
      notify("Successfully Order Create!", { type: "success" });
    } catch (err: any) {
      notify(err.message || "Failed!", { type: "warning" });
    }
  };

  return (
    <Create {...props} redirect="list" onSubmit={onSave}>
      <SimpleForm>
        <LabPopulateUserInfo
          isUserChecked={isUserChecked}
          setIsUserChecked={setIsUserChecked}
          setHasLocationField={setHasLocationField}
          receiveUserData={receiveUserData}
        />
        <CheckOrder
          isUserChecked={isUserChecked}
          locations={locations}
          setLocations={setLocations}
          setHasLocationField={setHasLocationField}
          setSubAreaId={setSubAreaId}
          hasSubArea={hasSubArea}
          setHasSubArea={setHasSubArea}
          currentSubArea={currentSubArea}
          setCurrentSubArea={setCurrentSubArea}
        />
        <>
          <Grid container spacing={1}>
            <div className={classes.cartDetails2} style={{ width: "100%" }}>
              <Typography
                variant="h6"
                color="initial"
                style={{ marginBottom: 4 }}
              >
                Reference Order (Optional)
              </Typography>
              <Grid container spacing={1}>
                <Grid item lg={4}>
                  <DateInput
                    source="orderedAt"
                    label="Ordered At"
                    variant="outlined"
                    value={orderedAt}
                    onChange={(e) => setOrderedAt(e.target.value)}
                    fullWidth
                    // resettable
                    alwaysOn
                  />
                </Grid>
                <Grid item lg={4}>
                  <TextInput
                    source="orderNumberPrefix"
                    label="Order ID Last 4 Digit"
                    variant="outlined"
                    value={orderNumberPrefix}
                    onChange={(e) => setOrderNumberPrefix(e.target.value)}
                    fullWidth
                    resettable
                    alwaysOn
                  />
                </Grid>
                <Grid item lg={4} style={{ marginTop: 9 }}>
                  <LoaderOrButton
                    label="Check Order"
                    isLoadingLabel={isLoading}
                    btnVariant="contained"
                    fullWidth
                    btnColor="primary"
                    onClick={handleOrder}
                  />
                </Grid>

                {order && (
                  <>
                    <Grid item lg={4}>
                      <Typography
                        variant="h6"
                        color="initial"
                        style={{ marginTop: 50 }}
                      >
                        Assigned To: {order?.assignedTo?.name}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </div>
            <Grid item lg={4}>
              <Typography variant="h6" color="initial">
                Schedule Date
                {getFormattedDateString(order?.scheduleStartAt)}
              </Typography>
              <SelectInput
                variant="outlined"
                label="Schedule Date"
                source="scheduleDate"
                choices={scheduleDate?.map((item) => ({
                  id: item.title.en,
                  name: item.title.en,
                }))}
                onChange={(e) => setScheduleSelectDate(e.target.value)}
                defaultValue={order?.scheduleStartAt}
                fullWidth
                alwaysOn
              />
            </Grid>
            <Grid item lg={4}>
              <Typography variant="h6" color="initial">
                Schedule Time
                {order?.scheduleTimeRange?.en}
              </Typography>
              <SelectInput
                variant="outlined"
                label="Schedule Time"
                source="scheduleTimeUqid"
                choices={mainTimes?.times?.map((item) => ({
                  id: item.id,
                  name: item.title.en,
                }))}
                onChange={(e) => setScheduleSelectTime(e.target.value)}
                defaultValue={order?.scheduleTimeRange?.en}
                fullWidth
                alwaysOn
              />
            </Grid>
            <Grid item lg={6}>
              <SelectInput
                source="paymentMethod"
                label="Payment Method"
                variant="outlined"
                choices={[
                  { id: "cod", name: "COD" },
                  { id: "online", name: "Online" },
                ]}
                // allowEmpty
                fullWidth
              />
            </Grid>
            <Grid item lg={6}>
              <TextInput
                source="additionalNotes"
                label="Additional Note"
                variant="outlined"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item lg={4}>
              <BooleanInput
                label="Hardcopy of Reports"
                source="isHardCopyRequired"
                onChange={handleIsDeliveryRequiredChange}
                initialValue={
                  order?.isHardCopyRequired ||
                  order?.isHardCopyRequired === null
                    ? order?.isHardCopyRequired
                    : false
                }
              />
            </Grid>
            <Grid item lg={4}>
              <BooleanInput
                label="Delivery Conveyance"
                source="applyHardCopyConveyance"
                onChange={handleApplyDeliveryFee}
                defaultValue={applyHardCopyConveyance}
                disabled={isHardCopyRequired === false}
              />
            </Grid>
            <Grid item lg={4}>
              <BooleanInput
                label="Sample Collection Conveyance"
                source="applyCollectionConveyance"
                onChange={handleApplySampleCollectionFeeChange}
                defaultValue
              />
            </Grid>
          </Grid>
        </>
        <ReferenceInput
          source="vendorUqid"
          label="Vendor"
          reference="misc/api/v1/admin/vendor"
          variant="outlined"
          filter={{
            _status: "active",
          }}
          //   validate={[required()]}
        >
          <AutocompleteInput
            optionText={(record) => `${record?.name?.en}`}
            matchSuggestion={() => true}
            helperText={false}
            onSelect={handleSupplierChange}
            // resettable
          />
        </ReferenceInput>
        <div className={classes.cartDetails}>
          <LabTestAdd
            selectedLabTest={selectedLabTest}
            labTestOptions={labTestOptions}
            setLabTestSearchText={setLabTestSearchText}
            setSelectedLabTest={setSelectedLabTest}
            setBookFor={setBookFor}
            bookFor={bookFor}
            setSelectedLabTests={setSelectedLabTests}
            selectedLabTests={selectedLabTests}
          />
          <LabTestTable
            selectedLabTests={selectedLabTests}
            setSelectedLabTests={setSelectedLabTests}
            refetch={refetch}
            isLoading={isLoading}
          />

          {isSuccess && calculate && <LabTestCalculate calculate={calculate} />}
        </div>
        <FormSpy
          subscription={{ values: true }}
          onChange={({ values }) =>
            setTimeout(() => {
              setFormValues(values);
            }, 0)
          }
        />
      </SimpleForm>
    </Create>
  );
};

const useStyles = makeStyles(() => ({
  cartDetails: {
    borderRadius: 6,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  cartDetails2: {
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
}));

export default memo(LabOrderCreate);
