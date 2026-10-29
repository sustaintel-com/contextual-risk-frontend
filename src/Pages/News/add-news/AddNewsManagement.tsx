import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { useSnackbar } from "../../../Context/SnackbarContext";
import NewsForm from "./NewsForm";

const AddNewsManagement: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showSnackbar } = useSnackbar();

    // Read return route state if passed from the list
    const fromPath = location.state?.from || "/news";

    // Initialize React Hook Form with default values
    const { control, handleSubmit } = useForm({
        defaultValues: {
            state: "",
            district: "",
            geographicalLocations: "",
            pincode: "",
            theme: "",
            infoType: "",
            industry: "",
            sector: "",
            caseId: "",
            dateYear: "",
            topics: "",
            newsTitle: "",
            newsUrl: "",
        },
    });

    // --- Demo Data from Excel File ---
    const stateOptions = [
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Kerala", value: "Kerala" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    ];

    const districtOptions = [
        { label: "Raigarh", value: "Raigarh" },
        { label: "Idukki", value: "Idukki" },
        { label: "Sidhi", value: "Sidhi" },
        { label: "Kondagaon", value: "Kondagaon" },
    ];

    const locationOptions = [
        { label: "Dharamjaigarh", value: "Dharamjaigarh" },
        { label: "Manjumala / Peermade", value: "Manjumala / Peermade" },
        { label: "Dainiha", value: "Dainiha" },
        { label: "Kokodi", value: "Kokodi" },
    ];

    const pincodeOptions = [
        { label: "496116", value: "496116" },
        { label: "685533", value: "685533" },
        { label: "486661", value: "486661" },
        { label: "494226", value: "494226" },
    ];

    const themeOptions = [
        { label: "Environment", value: "Environment" },
        { label: "Economy", value: "Economy" },
    ];

    const infoTypeOptions = [
        { label: "News Article", value: "News Article" },
        { label: "Press Release", value: "Press Release" },
    ];

    const industryOptions = [
        { label: "Mining", value: "Mining" },
        { label: "Energy", value: "Energy" },
    ];

    const sectorOptions = [
        { label: "Public", value: "Public" },
        { label: "Private", value: "Private" },
    ];

    // Form Submission handler
    const onSubmit = (data: any) => {
        console.log("Form Submitted Data:", data);
        showSnackbar("News article added successfully!", { type: "success", duration: 3000 });
        navigate(fromPath);
    };

    const handleBack = () => {
        navigate(fromPath);
    };

    return (
        <NewsForm
            title="Add News Article"
            subtitle="Enter the details of the news record based on contextual database."
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            stateOptions={stateOptions}
            districtOptions={districtOptions}
            locationOptions={locationOptions}
            pincodeOptions={pincodeOptions}
            themeOptions={themeOptions}
            infoTypeOptions={infoTypeOptions}
            industryOptions={industryOptions}
            sectorOptions={sectorOptions}
            onBack={handleBack}
            submitLabel="Save News"
            backLabel="Go Back"
        />
    );
};

export default AddNewsManagement;