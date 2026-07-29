type UserInputProps = {
    label: string,
    type: string,
    value?: string,
    name: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
}

export default function UserInput({ label, type, value, name, handleChange, required = false }: UserInputProps) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                className="form-input"
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                required={required}
            />
        </div>
    )
}