import React from "react";
import "./LoadingIcon.css";

export default function LoadingIcon() {
    return (
        <div className='lds-ring'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
