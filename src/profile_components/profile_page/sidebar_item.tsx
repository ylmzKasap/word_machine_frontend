export const SideBarItem: React.FC<SideBarItemTypes> = (
  { description, icon, clickHandler, mouseUpHandler, specialClass }) => {
  // Component of ProfilePage.

  return (
    <div className={`sidebar-item${specialClass ? ` ${specialClass}` : ''}`}
      onClick={clickHandler} onMouseUp={mouseUpHandler}>
      <i id="sidebar-icon" className={icon} />
      <div className="sidebar-description"> {description} </div>
    </div>
  );
};

interface SideBarItemTypes {
  description: string;
  icon: string;
  clickHandler?: React.Dispatch<any>;
  mouseUpHandler?: React.Dispatch<any>;
  specialClass?: string;
};
