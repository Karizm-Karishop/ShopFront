import { Outlet } from 'react-router-dom';
import DashboardSideNav from '../Artist/DashboardSideNav';
import Navbar from './DashBoardNav';
import { useAppSelector } from '../../../Redux/hooks';
import { RootState } from '../../../Redux/store';

function DashboardLayout() {
  const user= useAppSelector((state:RootState)=>state.loginIn.user);
  return (
    <div className="bg-dashgrey flex flex-col  min-h-screen">
      <div className="fixed bg-white top-0 left-0 right-0 z-50">
        <Navbar userName={user?.firstName+' '+ user?.lastName}/>
      </div>
      <div>
        <div className="mt-16 px-10 overflow-y-auto">
          <DashboardSideNav />
        </div>
        <div className="p-4 lg:ml-[200px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
