import { Brainly } from "../../icons/Brainly";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { Youtube } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SideBarItem";
import { Dispatch, SetStateAction } from 'react';
type SetFilterType = Dispatch<SetStateAction<"all" | "twitter" | "youtube">>;

interface SideBarProps {
    setFilterType: SetFilterType; // Add setFilterType prop
  }

  export function SideBar({ setActiveTab }: SideBarProps) {
    return <div className="h-screen w-64 sm:w-48 fixed left-0 bg-white">
        <div className="flex text-2xl pt-6 items-center ">
            <div className="mr-2 text-purple-700 pl-6">
                <Brainly/>
            </div>
            <div className="hover: cursor-pointer">
            Brainly
            </div>
        </div>
     <div className="pt-2 pl-5">
      <SideBarItem 
          text="Twitter" 
          icon={<TwitterIcon />} 
          className="pr-4 sm:pr-0" 
          onClick={() => setActiveTab("twitter")} 
        /> 
        <SideBarItem 
          text="Youtube" 
          icon={<Youtube />} 
          className="pr-4 sm:pr-0" 
          onClick={() => setActiveTab("youtube")} 
        />  
     </div>
    </div>
}