import React from 'react';
import PropTypes from 'prop-types';

function ButtonComponent({classes, click, width, disable}) {
    return (
        <button className={"btn btn-outline-secondary col-sm-" + width}
                style={{marginBottom: '5px'}}
                type="button"
                onClick={click}
                disabled={disable}>
            {
                classes.map((c, index) => {
                    return (
                        <i key={index} className={c}></i>
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
