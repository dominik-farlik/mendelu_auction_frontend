import './Filters.css';
import FilterGroup from "./FilterGroup.tsx";

const PRICE_FILTERS = [
    {title: "Cena", type: "range"},
]

const GROUP_FILTERS = [
    {title: "Skupina 1", type: "checkbox"},
    {title: "Skupina 2", type: "checkbox"},
    {title: "Skupina 3", type: "checkbox"},
]

export default function Filters() {
    return (
        <div className="filters">
            <FilterGroup title="Cena" filters={PRICE_FILTERS}></FilterGroup>
            <FilterGroup title="Skupiny" filters={GROUP_FILTERS}></FilterGroup>
        </div>
    )
}