import './Pagination.css';

type PaginationProps = {
    totalItems: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
};

export default function Pagination({ totalItems, activeIndex, onDotClick }: PaginationProps) {
    return (
        <div className="pagination">
            {Array.from({ length: totalItems }).map((_, index) => (
                <button
                    key={index}
                    className={`dot ${index === activeIndex ? "active" : ""}`}
                    onClick={() => onDotClick(index)}
                    aria-label={`Přejít na položku ${index + 1}`}
                />
            ))}
        </div>
    );
}