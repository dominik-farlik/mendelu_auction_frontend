import React from 'react';

interface Identifiable {
    id: number;
    [key: string]: unknown;
}

type ListProps<T extends Identifiable> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
}

export default function List<T extends Identifiable>({ items, renderItem }: ListProps<T>) {
    return (
        <div className="list-container">
            {items.map((item, index) => (
                <div className="list-item" key={item.id || index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
}