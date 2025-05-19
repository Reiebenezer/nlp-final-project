import { CheckIcon } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, MouseEventHandler, SetStateAction } from "react";

interface CheckButtonParams extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
    setActive?: (value: SetStateAction<boolean>) => void
}

export default function CheckButton({ active = false, setActive, children, ...props }: CheckButtonParams) {
    const onClick: MouseEventHandler<HTMLButtonElement> = e => {
        setActive?.(!active);
        props.onClick?.(e);
    }

    return (
        <button {...props} onClick={onClick} className={`${active && "bg-foreground text-background"} ${props.className}`}>
            {active && <CheckIcon />}
            {children}
        </button>
    )
}