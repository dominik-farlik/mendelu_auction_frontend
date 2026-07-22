type FilterProps = {
    title: string,
    type: string
}

export default function Filter({ title, type }: FilterProps) {
    return (
        <label>
            <input type={type}/>
            {title}
        </label>
    )
}