type MenuButtonProps = {
    title: string;
    windowName: string;
    active: boolean;
    handleTabChange: (windowName: string) => void;
};

export default function MenuButton({ title, windowName, active, handleTabChange }: MenuButtonProps) {
    return (
        <button
            className={active ? "active" : ""}
            onClick={() => handleTabChange(windowName)}
        >
            {title}
        </button>
    );
}