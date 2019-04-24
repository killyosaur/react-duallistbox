import React from 'react';
import PropTypes from 'prop-types';

function ButtonComponent({classes, click, width, disable}) {
    return (
        <button className={"btn btn-default col-sm-" + width}
                style={{marginBottom: '5px'}}
                type="button"
                onClick={click}
                disabled={disable}>
            {
                classes.map((c, index) => {
                    return (
                        <i key={index} className={"glyphicon " + c}></i>
                    );
                })
            }
        </button>
    );
}
ButtonComponent.propTypes = {
    classes: PropTypes.arrayOf(PropTypes.string).isRequired,
    click: PropTypes.func,
    width: PropTypes.number.isRequired,
    disable: PropTypes.bool
};

export {ButtonComponent};
/*
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 65 65"><path fill="currentColor" d="M5 5 h10 v10 h-10 zm0 15 h10 v10 h-10 zm0 15 h10 v10 h-10 zm0 15 h10 v10 h-10 zm15 0 h40 v10 h-40zm0 -15 h40 v10 h-40zm0 -15 h40 v10 h-40zm0 -15 h40 v10 h-40z" /></svg>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 45 65"><path fill="currentColor" d="M12 7.5 l25 25 l-25 25 l-7.07107 -7.07107 l17.92893 -17.92893 l-17.92893 -17.92893Z" /></svg>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 45 65"><path fill="currentColor" d="M32 7.5 l-25 25 l25 25 l7.07107 -7.07107 l-17.92893 -17.92893 l17.92893 -17.92893Z" /></svg>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 65 65"><path fill="currentColor" d="M12 7.5 l25 25 l-25 25 l-7.07107 -7.07107 l17.92893 -17.92893 l-17.92893 -17.92893zm20 0 l25 25 l-25 25 l-7.07107 -7.07107 l17.92893 -17.92893 l-17.92893 -17.92893Z" /></svg>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 65 65"><path fill="currentColor" d="M32 7.5 l-25 25 l25 25 l7.07107 -7.07107 l-17.92893 -17.92893 l17.92893 -17.92893zm20 0 l-25 25 l25 25 l7.07107 -7.07107 l-17.92893 -17.92893 l17.92893 -17.92893Z" /></svg>
*/