import Tippy from "@tippyjs/react/headless";
import Button from "./Button";

function DropDownMenu({ className, classNameBtn, children, items = [], ...passProps }) {
    return (
        <Tippy
            hideOnClick={true}
            delay={[0, 100]}
            offset={[12, 8]}
            interactive
            placement="bottom-start"
            render={attrs => (
                <div className="content w-full min-w-[20px] mt-4 shadow-lg bg-white rounded-lg border border-gray-200" tabIndex={-1} {...attrs}>
                    <ul className={`menu-body h-auto m-2 py-3 flex flex-row mx-3 ${className}`}>
                        {
                            items.map((childrenItem, index) => (
                                <li key={index} className="text-green-700 mr-6">
                                    <Button className={`block w-full bg-white font-bold text-base text-green-700 w-full hover:bg-white uppercase ${classNameBtn}`} icon={childrenItem.icon} title={childrenItem.brand || childrenItem.title} to={childrenItem.to} />
                                    {childrenItem.data?.length > 0 &&
                                        childrenItem.data.map((item, itemIndex) => (
                                            <Button key={itemIndex} className="block max-w-56 w-full my-1 bg-white font-normal text-sm text-black w-full hover:bg-green-700 hover:text-white" title={item.name} to={item.to} />
                                        ))
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
            {...passProps}
        >
            <div>
                {children}
            </div>
        </Tippy>
    );


}

export default DropDownMenu;