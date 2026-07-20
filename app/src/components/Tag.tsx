import './Tag.css';

type TagProps = {
    text: string;
    color?: 'white' | 'blue';
    fill?: boolean;
};

export default function Tag({ text, color = 'blue', fill = false }: TagProps) {
    const classes = [
        'tag',
        `tag-${color}`,
        fill ? 'tag-fill' : 'tag-outline'
    ].join(' ');

    return (
        <span className={classes}>
            {text}
        </span>
    );
}