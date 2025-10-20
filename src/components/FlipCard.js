import React from "react";
import './FlipCard.css';

function FlipCard({ front,back}){
    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    {front}
                </div>
                <div className="flip-card-back">
                    {back}
                </div>
            </div>
        </div>
    );
}

export default FlipCard;
