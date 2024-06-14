import React, { useState } from "react";
import "./Annotations.css";

export default function Annotations({ annotations, setAnnotations }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleItemClick = (index) => {
        setAnnotations(
            annotations.map((item, i) => {
                if (i === index) {
                    return { ...item, value: !item.value };
                }
                return item;
            })
        );
    };

    return (
        <div className='annotations-container'>
            <p onClick={toggleDropdown} className='annotations-button'>
                Annotations
            </p>
            {isOpen && (
                <ul className='annotations-ul'>
                    {annotations.map((item, index) => (
                        <li className='annotations-list' key={index}>
                            {item.name}
                            <input type='checkbox' checked={item.value} onChange={() => handleItemClick(index)}></input>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
