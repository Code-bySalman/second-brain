import { ReactElement } from "react";

  interface ButtonProps{
    variant: "primary" | "Welcome "  |        "secondary";
    size: "sm"
| "md" | "lg";
text: string;
startIcon?: ReactElement;
endIcon?: ReactElement;
onClick?: ()=> void;

}

const variantStyle = {
  "primary": "bg-purple-600 text-white",
  "secondary": "bg-purple-200 text-purple-600",
  "Welcome" : "bg-purple-700 text-white "
}
const defaultStyle = "rounded-lg flex px-4 py-2 font-light "
const sizeStyle = {
  "sm": "py-1 px-2 text-sm rounded-sm",
  "md": "py-2 px-4 text-md rounded-md",
  "lg": "py-4 px-6 text-md rounded-md"
}
export const Button= ({variant, text , startIcon,  onClick}: ButtonProps) =>{
    return <button onClick={onClick} className={variantStyle[variant] + " " + defaultStyle}>
      <div className="inline-block align-middle pr-2">
      {startIcon}
     </div>
     <span className="align-middle">
     {text}
     </span>
    </button>
}

<Button variant = "primary" size = "md" onClick={() => {}} text = {"salman"} /> 