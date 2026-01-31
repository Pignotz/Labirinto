import {Button} from "@heroui/react";

type Props = {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
};

export default function MyButton({ children, onPress, className = "" }: Props) {
    return (
        <Button onPress={onPress} className={`rounded-md ${className}`}>
            {children}
        </Button>
    );
}