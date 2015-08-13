
import React from "react";

// a very simple spinner
export default class Spinner extends React.Component {
    render () {
        let size = 52
        ,   fill = this.props.fill || "#f1647c"
        ;
        if (this.props.size === "small") size /= 2;
        return <div className="spinner">
                <svg xmlns="http://www.w3.org/2000/svg" width={size + "px"} height={size + "px"} viewBox="0 0 52 52">
                    <style>{`
                        @keyframes fading {
                            0%      { opacity: 1; }
                            100%    { opacity: 0; }
                        }
                        .spinner ellipse {
                            opacity:    0;
                        }
                        .spinner .sp1 { animation: fading 1s 0s ease infinite; }
                        .spinner .sp2 { animation: fading 1s 0.1111s ease infinite; }
                        .spinner .sp3 { animation: fading 1s 0.2222s ease infinite; }
                        .spinner .sp4 { animation: fading 1s 0.3333s ease infinite; }
                        .spinner .sp5 { animation: fading 1s 0.4444s ease infinite; }
                        .spinner .sp6 { animation: fading 1s 0.5556s ease infinite; }
                        .spinner .sp7 { animation: fading 1s 0.6667s ease infinite; }
                        .spinner .sp8 { animation: fading 1s 0.7778s ease infinite; }
                        .spinner .sp9 { animation: fading 1s 0.8889s ease infinite; }
                    `}
                    </style>
                  <g fill={fill}>
                    <ellipse transform="rotate(0, 26, 6)" cx="26" cy="6" rx="2.6153393661244038" ry="6" className="sp1"/>
                    <ellipse transform="rotate(40, 38.8558, 10.6791)" cx="38.8558" cy="10.6791" rx="2.6153393661244038" ry="6" className="sp2"/>
                    <ellipse transform="rotate(80, 45.6962, 22.527)" cx="45.6962" cy="22.527" rx="2.6153393661244038" ry="6" className="sp3"/>
                    <ellipse transform="rotate(120, 43.3205, 36)" cx="43.3205" cy="36" rx="2.6153393661244038" ry="6" className="sp4"/>
                    <ellipse transform="rotate(160, 32.8404, 44.7939)" cx="32.8404" cy="44.7939" rx="2.6153393661244038" ry="6" className="sp5"/>
                    <ellipse transform="rotate(200, 19.1596, 44.7939)" cx="19.1596" cy="44.7939" rx="2.6153393661244038" ry="6" className="sp6"/>
                    <ellipse transform="rotate(240, 8.6795, 36)" cx="8.6795" cy="36" rx="2.6153393661244038" ry="6" className="sp7"/>
                    <ellipse transform="rotate(280, 6.3038, 22.527)" cx="6.3038" cy="22.527" rx="2.6153393661244038" ry="6" className="sp8"/>
                    <ellipse transform="rotate(320, 13.1442, 10.6791)" cx="13.1442" cy="10.6791" rx="2.6153393661244038" ry="6" className="sp9"/>
                  </g>
                </svg>
            </div>;
    }
}
