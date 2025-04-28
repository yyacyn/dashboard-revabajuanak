import { useState } from "react";
// import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import Select from "../Select";
import TextArea from "../input/TextArea";
// import { CalenderIcon, EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";
// import Flatpickr from "react-flatpickr";

export default function DefaultInputs() {
    const [message, setMessage] = useState("");
    // const [messageTwo, setMessageTwo] = useState("");
    // const [showPassword, setShowPassword] = useState(false);
    const options = [
        { value: "baju", label: "Baju" },
        { value: "celana", label: "Celana" },
        { value: "aksesoris", label: "Aksesoris" },
    ];
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    // const [dateOfBirth, setDateOfBirth] = useState("");

    // const handleDateChange = (date: Date[]) => {
    //     setDateOfBirth(date[0].toLocaleDateString()); // Handle selected date and format it
    // };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file.name);
        }
    };
    return (
            <div className="grid grid-cols-2 space-y-6 p-8 dark:bg-dark-500 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] gap-10">
                <div>
                    <Label htmlFor="input">Product Name</Label>
                    <Input type="text" id="input" />
                </div>
                <div className="m-0" style={{ marginTop: "0px" }}>
                    <Label>Description</Label>
                    <TextArea
                        value={message}
                        onChange={(value) => setMessage(value)}
                        rows={6}
                    />
                </div>
                <div>
                    <Label>Kategori</Label>
                    <Select
                        options={options}
                        placeholder="Select an option"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                </div>
                <div>
                    <Label htmlFor="input">Tag</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label htmlFor="input">Price</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label htmlFor="input">Quantity</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label htmlFor="input">Image URL</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label>Upload file</Label>
                    <FileInput onChange={handleFileChange} className="custom-class" />
                </div>
            </div >
    );
}
