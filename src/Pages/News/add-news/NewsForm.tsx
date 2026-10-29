import React from "react";
import { Controller } from "react-hook-form";
import { FileText, Tag, Globe, Undo2, Save } from "lucide-react";
import SelectionInput from "../../../components/inputs/SelectInput";
import FormInput from "../../../components/inputs/FormInput";
import Button from "../../../components/buttons/Button";
import DateTimeSelector from "../../../components/calender/DateAndTimeSelector";

interface Option {
    label: string;
    value: string | number;
}

interface NewsFormProps {
    title: string;
    subtitle: string;
    control: any;
    handleSubmit: any;
    onSubmit: (data: any) => void;
    stateOptions: Option[];
    districtOptions: Option[];
    locationOptions: Option[];
    pincodeOptions: Option[];
    themeOptions: Option[];
    infoTypeOptions: Option[];
    industryOptions: Option[];
    sectorOptions: Option[];
    onBack: () => void;
    submitLabel: string;
    backLabel: string;
}

const NewsForm: React.FC<NewsFormProps> = ({
    title,
    subtitle,
    control,
    handleSubmit,
    onSubmit,
    stateOptions,
    districtOptions,
    locationOptions,
    pincodeOptions,
    themeOptions,
    infoTypeOptions,
    industryOptions,
    sectorOptions,
    onBack,
    submitLabel,
    backLabel,
}) => {
    return (
        <div className="flex flex-col items-center p-4 font-sans">
            <div className="w-full bg-white p-8 rounded-md shadow border border-gray-100">
                <div className="mb-6 text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <p className="text-gray-500 mt-1">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* State (Flat Dropdown) */}
                        <Controller
                            name="state"
                            control={control}
                            rules={{ required: "State is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="State"
                                    placeholder="Select State"
                                    options={stateOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* District (Flat Dropdown) */}
                        <Controller
                            name="district"
                            control={control}
                            rules={{ required: "District is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="District"
                                    placeholder="Select District"
                                    options={districtOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Geographical Locations (Flat Dropdown) */}
                        <Controller
                            name="geographicalLocations"
                            control={control}
                            rules={{ required: "Geographical location is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Geographical Locations"
                                    placeholder="Select Location"
                                    options={locationOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Pincode (Flat Dropdown / Input) */}
                        <Controller
                            name="pincode"
                            control={control}
                            rules={{ required: "Pincode is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Pincode"
                                    placeholder="Select Pincode"
                                    options={pincodeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Theme */}
                        <Controller
                            name="theme"
                            control={control}
                            rules={{ required: "Theme is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Theme"
                                    placeholder="Select Theme"
                                    options={themeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Info Type */}
                        <Controller
                            name="infoType"
                            control={control}
                            rules={{ required: "Info Type is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Info Type"
                                    placeholder="Select Info Type"
                                    options={infoTypeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Industry */}
                        <Controller
                            name="industry"
                            control={control}
                            rules={{ required: "Industry is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Industry"
                                    placeholder="Select Industry"
                                    options={industryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Sector */}
                        <Controller
                            name="sector"
                            control={control}
                            rules={{ required: "Sector is required" }}
                            render={({ field, fieldState }) => (
                                <SelectionInput
                                    label="Sector"
                                    placeholder="Select Sector"
                                    options={sectorOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Case ID */}
                        <Controller
                            name="caseId"
                            control={control}
                            rules={{ required: "Case ID is required" }}
                            render={({ field, fieldState }) => (
                                <FormInput
                                    label="Case ID"
                                    placeholder="e.g. NA-En-001-A"
                                    leftIcon={<FileText size={18} />}
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* Date / Year Picker */}
                        <Controller
                            name="dateYear"
                            control={control}
                            rules={{ required: "Date / Year is required" }}
                            render={({ field, fieldState }) => (
                                <DateTimeSelector
                                    label="Date / Year"
                                    required={true}
                                    mode="date"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-6 pt-2">
                        {/* Topics */}
                        <Controller
                            name="topics"
                            control={control}
                            rules={{ required: "At least one topic is required" }}
                            render={({ field, fieldState }) => (
                                <FormInput
                                    label="Topics (comma separated)"
                                    placeholder="e.g. Coal mine, Environment concern, Tribals' protest"
                                    leftIcon={<Tag size={18} />}
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* News Title */}
                        <Controller
                            name="newsTitle"
                            control={control}
                            rules={{ required: "News Title is required" }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-medium text-gray-700">News Title</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Enter news title description..."
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                                        {...field}
                                    />
                                    {fieldState.error?.message && (
                                        <span className="text-xs text-red-500">{fieldState.error.message}</span>
                                    )}
                                </div>
                            )}
                        />

                        {/* News URL */}
                        <Controller
                            name="newsUrl"
                            control={control}
                            rules={{ required: "News URL is required" }}
                            render={({ field, fieldState }) => (
                                <FormInput
                                    label="News URL"
                                    placeholder="https://example.com/news-article"
                                    leftIcon={<Globe size={18} />}
                                    {...field}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            label={backLabel}
                            size="sm"
                            variant="danger"
                            type="button"
                            icon={<Undo2 size={18} />}
                            onClick={onBack}
                        />
                        <Button
                            label={submitLabel}
                            size="sm"
                            variant="success"
                            type="submit"
                            icon={<Save size={18} />}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsForm;