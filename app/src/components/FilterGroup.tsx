import Filter from "./Filter.tsx";

interface Filter {
    title: string,
    type: string,
}

type FilterGroupProps = {
    title: string,
    filters?: Array<Filter>,
};


export default function FilterGroup({ title, filters = [] }: FilterGroupProps) {
    return (
        <div className="filter-group">
            <span className="filter-group-title">{title}</span>
            <div className='filter-container'>
                {
                    filters.map((filter, index) => (
                        <Filter
                            key={index}
                            title={filter.title}
                            type={filter.type}
                        />
                    ))
                }
            </div>
        </div>
    )
}