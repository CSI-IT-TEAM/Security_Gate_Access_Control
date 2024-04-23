import Select from "react-select";

const SelectList = ({ name, options, value, handleChange }) => {
    return (
        <>
            <Select
                value={value}
                onChange={(e) => handleChange(name, e.value)}
                name={name}
                options={options}
                classNames={{
                    control: (state) =>
                        state.isFocused ? "border-red-600" : "border-grey-300",
                }}
                styles={{
                    control: (base, { isDisabled, isFocused }) => ({
                        ...base,
                        padding: 4,
                        borderRadius: 5,
                        fontSize: 18,
                        background: isDisabled ? "#f8f6f7" : "#fff",
                        borderColor: "#b8b6b7",
                    }),
                    menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        fontSize: 17,
                        color: "#000"
                    }),
                }}
            />
        </>
    )
}

export default SelectList;