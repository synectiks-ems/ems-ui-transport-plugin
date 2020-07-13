import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import '../../../css/college-settings.css';
import {
    VEHICLE_DATA_CACHE,INSURANCE_DATA_CACHE,GET_TRANSPORT_ROUTE_LIST, GET_STOPAGE_LIST
} from '../_queries';
 import { withApollo } from 'react-apollo';
 import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
import AddRoute from './AddRoute';
import AddStopage from './AddStopage';
import AddVehicleDriverLink from './AddVehicleDriverLink';
// import VehicleListPage from './VehicleListPage';
// import VehicleDetails from './VehicleDetails';
// import DriverListPage from '../DriverListPage/DriverListPage';
export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any,
}
class vehicle extends React.Component<VehicleProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            user: this.props.user,
            transportRouteList: null,
            stopageList: null,
            vehicleFilterCacheList: null,
            insuranceFilterCacheList:null,
            branchId: null,
            academicYearId: null,
            departmentId: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.getVehicleFilterCacheList = this.getVehicleFilterCacheList.bind(this);
        this.getTransportRouteList = this.getTransportRouteList.bind(this);
        this.getStopageList = this.getStopageList.bind(this);
        // this.getInsuranceFilterCacheList = this.getInsuranceFilterCacheList.bind(this);
    }
    

    registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("Vehicle Index. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("Vehicle Index. branchId: ",this.state.branchId);
            console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
            console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
        }
    
        socket.onopen = () => {
            console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
            socket.send(this.state.user.login);
        }
    
        window.onbeforeunload = () => {
            console.log("Vehicle. Closing websocket connection with cms backend service");
        }
      }

    toggleTab(tabNo: any) {
        if(tabNo === 1 ){
            this.getVehicleFilterCacheList();
        }
        if(tabNo===2){
            // this.getStopageList();
            this.getVehicleFilterCacheList();

        }
        if(tabNo === 3 ){
            this.getVehicleFilterCacheList();
        }
        if(tabNo === 4 ){
            this.getVehicleFilterCacheList();
        }
        if(tabNo === 5 ){
            this.getVehicleFilterCacheList();
        }
        this.setState({
            activeTab: tabNo,
        });
    }
    async getStopageList(){
        const {data} = await this.props.client.query({
            query: GET_STOPAGE_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            stopageList: data,
          });
    }
    async getTransportRouteList(){
        const {data} = await this.props.client.query({
            query: GET_TRANSPORT_ROUTE_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            transportRouteList: data,
          });
    }
    async getVehicleFilterCacheList() {
        const {data} = await this.props.client.query({
          query: VEHICLE_DATA_CACHE,
            variables: {
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            vehicleFilterCacheList: data,
        });
      }
      async getInsuranceFilterCacheList() {
        const {data} = await this.props.client.query({
          query: INSURANCE_DATA_CACHE,
            variables: {
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            insuranceFilterCacheList: data,
        });
      }
    render() {
        const { activeTab,stopageList,vehicleFilterCacheList, transportRouteList,insuranceFilterCacheList,user } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                 <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(0); }} >
                            Add Route Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(1); }} >
                            Add Stop page
                        </NavLink> 
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(2); }} >
                           Vehicle Route Details
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(3); }} >
                           Vehicle Driver Details
                        </NavLink>
                   </NavItem>
                   <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(4); }} >
                           Route Stopage Details
                        </NavLink>
                   </NavItem>
                   <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 5? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(5); }} >
                           Vehicle List Page 
                        </NavLink>
                   </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
     
               <TabPane tabId={0}>
                         <AddRoute/>
                         {/* 
                        {
                            user !== null && transportRouteList !== null && (
                                <AddRoute user={user} transportRouteList={transportRouteList.getTransportRouteList} />
                            )
                        } 
                         {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddRoute user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }  */}
                    </TabPane>
                    <TabPane tabId={1}>
                    {
                            user !== null && stopageList !== null && (
                                <AddStopage user={user} stopageList={stopageList.getStopageList}/>
                            )
                  
                        }      
                        {/* ADD STOPAGE */}
                    </TabPane>
                    <TabPane tabId={2}>
                        VehicleRouteLink
                    </TabPane>
                    <TabPane tabId={3}>
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddVehicleDriverLink user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }
                    </TabPane>
                    <TabPane tabId={4}>
                         Route Stopage Link
                    </TabPane>
                    <TabPane tabId={5}>
                         ListPage
                    </TabPane>
                </TabContent> 
            </section>
        );
    }
}
export default withApollo(vehicle)