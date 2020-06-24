import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;
    vehicleFilterCacheList?: any;
    transportRoute: any;
    contract:any;
    // insurance:any;
    employee:any;
    branches:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehicle service, vehicle could not be saved. Please check vehicles service logs";
const SUCCESS_MESSAGE_VEHICLE_ADDED = "New Vehicle saved successfully";
const SUCCESS_MESSAGE_VEHICLE_UPDATED = "vehicle updated successfully";
const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class Vehicle<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            vehicleList: this.props.vehicleList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            vehicleObj: {
                transportRouteId:"",
                contract:{
                    id:""
                },
                vehicle:{
                    id:""
                },
                transportRoute:{
                    id:""
                },
                contractId:"",
                employeeId:"",
                branchId: "",
                academicYearId: null,
                departmentId: null,
                vehicleNumber:"",
                vehicleType:"",
                capacity:"",
                ownerShip:"",
                dateOfRegistration:"",
                yearOfManufacturing:"",
                manufacturingCompany:"",
                model:"",
                chasisNo:"",
                rcNo:"",
                contactNumber:"",
                status:"",
                osIds:{
                   key_owned: "",
                   key_contracted: ""
                }
            },
            transportRoute: "",
            contract:"",
            employee:"",
            branches:"",
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createTransportRoutes = this.createTransportRoutes.bind(this);
        this.createContract = this.createContract.bind(this);

        // this.createInsurance = this.createInsurance.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.createEmployee = this.createEmployee.bind(this);
        this.createBranches = this.createBranches.bind(this);
        
    }
    
  async componentDidMount(){
    await this.registerSocket();
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

  createTransportRoutes(transportRoute: any) {
    let transportRoutesOptions = [
      <option key={0} value="">
        Select Route
      </option>,
    ];
    for (let i = 0; i < transportRoute.length; i++) {
        transportRoutesOptions.push(
        <option key={transportRoute[i].id} value={transportRoute[i].id}>
          {transportRoute[i].routeName}
        </option>
      );
    }
    return transportRoutesOptions;
  }
  createContract(contract: any) {
    let contractOptions = [
      <option key={0} value="">
        Select TypeOfContract
      </option>,
    ];
    for (let i = 0; i < contract.length; i++) {
        contractOptions.push(
        <option key={contract[i].id} value={contract[i].id}>
          {contract[i].vendorName}
        </option>
      );
    }
    return contractOptions;
  }


//   createInsurance(insurance: any) {
//     let insurancesOptions = [
//       <option key={0} value="">
//         Select Insurance
//       </option>,
//     ];
//     for (let i = 0; i < insurance.length; i++) {
//         insurancesOptions.push(
//         <option key={insurance[i].id} value={insurance[i].id}>
//           {insurance[i].insuranceCompany}
//         </option>
//       );
//     }
//     return insurancesOptions;
//   }

  createEmployee(employee: any) {
    let employeesOptions = [
      <option key={0} value="">
        Select Designation
      </option>,
    ];
    for (let i = 0; i < employee.length; i++) {
        employeesOptions.push(
        <option key={employee[i].id} value={employee[i].id}>
          {employee[i].designation}
        </option>
      );
    }
    return employeesOptions;
  }

  createBranches(branches: any) {
    let branchesOptions = [
      <option key={0} value="">
        Select Branch
      </option>,
    ];
    for (let i = 0; i < branches.length; i++) {
        branchesOptions.push(
        <option key={branches[i].id} value={branches[i].id}>
          {branches[i].branchName}
        </option>
      );
    }
    return branchesOptions;
  }


  async showDetails(obj: any, e: any) {
    await this.SetObject(obj);
    console.log('3. data in vObj:', this.state.vObj);
    await this.toggleTab(0);
  }

  async SetObject(obj: any) {
    console.log('1. setting object :', obj);
    await this.setState({
      vObj: obj,
    });
    console.log('2. data in obj:', obj);
  }
  async toggleTab(tabNo: any) {
    await this.setState({
      activeTab: tabNo,
    });
  }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { vehicleObj } = this.state;
        vehicleObj.id = editObj.id;
        vehicleObj.employeeId = editObj.employeeId;
        vehicleObj.branchId = editObj.branchId;
        // vehicleObj.insuranceId = editObj.insuranceId;
        vehicleObj.transportRouteId = editObj.transportRouteId;
    
        vehicleObj.contractId = editObj.contractId;
        vehicleObj.vehicleNumber = editObj.vehicleNumber;
        vehicleObj.vehicleType = editObj.vehicleType;
        vehicleObj.capacity = editObj.capacity;
        vehicleObj.ownerShip = editObj.ownerShip;
        vehicleObj.dateOfRegistration = moment(editObj.strDateOfRegistration,"DD-MM-YYYY").format("YYYY-MM-DD");
        vehicleObj.yearOfManufacturing = editObj.yearOfManufacturing;
        vehicleObj.manufacturingCompany = editObj.manufacturingCompany;
        vehicleObj.model = editObj.model;
        vehicleObj.chasisNo = editObj.chasisNo;
        vehicleObj.rcNo = editObj.rcNo;
        vehicleObj.contactNumber = editObj.contactNumber;
        vehicleObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            vehicleObj: vehicleObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - vehicle list on vehicle page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const aryLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < aryLength; i++) {
            const obj = objAry[i];
            retVal.push(
              <tr >
                <td>{obj.id}</td>
                <td>{obj.vehicleNumber}</td>
                <td>{obj.vehicleType}</td>
                <td>{obj.capacity}</td>
                <td>{obj.contactNumber}</td>
                <td>{obj.strDateOfRegistration}</td>
                
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Vehicle")}>Edit</button>
                    }
                </td>
              </tr>
            );
        }
        return retVal;
    }

    showModal(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            vehicleObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { vehicleObj } = this.state;
        if (name === "ownerShip") {
            let cid: any = document.querySelector("#contractId");
            if(value === "OWNED"){
              cid.setAttribute("disabled", true);
              this.setState({
                vehicleObj: {
                  ...vehicleObj,
                  ownerShip: {
                    id: value
                  },
                }
              });
              this.getAddVehicleInput(vehicleObj, value);
            }else{
              cid.removeAttribute("disabled");
              this.setState({
                vehicleObj: {
                  ...vehicleObj,
                  ownerShip: {
                    id: value
                  }
                }
              });
              this.getAddVehicleInput(vehicleObj, value);
            }
            
          }else if (name === "CONTRACTED") {
            this.setState({
              vehicleObj: {
                ...vehicleObj,
                contractId: {
                  id: value
                }
              }
            });
        }
        this.setState({
            vehicleObj: {
                ...vehicleObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.transportRouteId === undefined || obj.transportRouteId === null || obj.transportRouteId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.transportRouteId === undefined || obj.transportRouteId === null) ? "" : obj.transportRouteId, "transportRouteId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.vehicleNumber === undefined || obj.vehicleNumber === null || obj.vehicleNumber === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleNumber === undefined || obj.vehicleNumber === null) ? "" : obj.vehicleNumber, "vehicleNumber");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.vehicleType === undefined || obj.vehicleType === null || obj.vehicleType === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleType === undefined || obj.vehicleType === null) ? "" : obj.vehicleType, "vehicleType");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

   async getAddVehicleInput(vehicleObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Vehicle"){
            id = vehicleObj.id;
        }
        let input = {
            id: id,
            // insuranceId: vehicleObj.insuranceId,
            transportRouteId: vehicleObj.transportRouteId,
            contractId:vehicleObj.contractId,
            employeeId:vehicleObj.employeeId,
            branchId:vehicleObj.branchId,
            vehicleNumber: vehicleObj.vehicleNumber,
            vehicleType: vehicleObj.vehicleType,
            capacity: vehicleObj.capacity, 
            ownerShip: vehicleObj.ownerShip,
            strDateOfRegistration: moment(vehicleObj.dateOfRegistration).format("DD-MM-YYYY"),
            yearOfManufacturing: vehicleObj.yearOfManufacturing,
            manufacturingCompany: vehicleObj.manufacturingCompany,
            model: vehicleObj.model,
            chasisNo: vehicleObj.chasisNo,
            rcNo: vehicleObj.rcNo,
            contactNumber: vehicleObj.contactNumber,
            status: vehicleObj.status,
        };
        this.initOwnerShip(input);
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_VEHICLE_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in addVehicle Mutation. Exit code : ",resp.data.addVehicle.cmsVehicleVo.exitCode);
            exitCode = resp.data.addVehicle.cmsVehicleVo.exitCode;
            let temp = resp.data.addVehicle.cmsVehicleVo.dataList; 
            console.log("New Vehicle list : ", temp);
            this.setState({
                vehicleList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addVehicle : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_VEHICLE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_VEHICLE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    initOwnerShip(data: any){
        const { vehicleObj } = this.state;
        // feeSettingData.dueDate.id = data.dueDateId;
    
        let ows: any = document.querySelector("#ownerShip");
        let cid: any = document.querySelector("#contractid");
    
        if(ows.options[ows.selectedIndex].value === "OWNED"){
          vehicleObj.osIds.key_owned = data.vehicleId;
        }else if(ows.options[ows.selectedIndex].value === "CONTRACTED"){ 
          vehicleObj.osIds.key_contracted = data.vehicleId;
        }
        vehicleObj.contract.id = data.contract;
        if(ows.options[ows.selectedIndex].value === "OWNED"){
            cid.setAttribute("disabled", true);
            cid.options.selectedIndex = 0;
          }else if(ows.options[ows.selectedIndex].value === ""){
            cid.removeAttribute("disabled");
            cid.options.selectedIndex = 0;
          }
          else{
            cid.removeAttribute("disabled");
          }
          this.setState({
            vehicleObj: vehicleObj
          });
    }

    save = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {vehicleObj, modelHeader} = this.state;
        let isValid = this.validateFields(vehicleObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddVehicleInput(vehicleObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {vehicleList, vehicleFilterCacheList,  isModalOpen, vehicleObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container" style={{height:"500px", overflow:"auto"}}>
                    <ModalHeader>{modelHeader}</ModalHeader>
                    <ModalBody className="modal-content">
                        

                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
                            {
                                errorMessage !== ""  ? 
                                    <MessageBox id="mbox" message={errorMessage} activeTab={2}/>        
                                    : null
                            }
                            {
                                successMessage !== ""  ? 
                                    <MessageBox id="mbox" message={successMessage} activeTab={1}/>        
                                    : null
                            }
                                <div className="mdflex modal-fwidth">
                                 {/* <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">Insurance<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="insuranceId" id="insuranceId" onChange={this.onChange}  value={vehicleObj.insuranceId} className="gf-form-label b-0 bg-transparent">
                                    {this.createInsurance(vehicleFilterCacheList.insurance)}
                                </select>
                                 </div> */}
                                 </div>
                                 <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Vehicle Number <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.vehicleNumber} placeholder="Vehicle Number" name="vehicleNumber" id="vehicleNumber" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Vehicle Type<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.vehicleType} placeholder="Vehicle Type" name="vehicleType" id="vehicleType" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Capacity <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.capacity} placeholder="Capacity" name="capacity" id="capacity" maxLength={255} />
                                    </div> 
                                    <div className="fwidth-modal-text">
                                    <label className="gf-form-label b-0 bg-transparent">OwnerShip<span style={{ color: 'red' }}> * </span></label>
                                        <select name="ownerShip" id="ownerShip" onChange={this.onChange} value={vehicleObj.ownerShip} className="gf-form-input">
                                            <option key={""} value={""}>Select OwnerShip</option>
                                            <option key={"OWNED"} value={"OWNED"}>Owned</option>
                                         <option key={"CONTRACTED"} value={"CONTRACTED"}>Contracted</option>
                                        </select>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Date OF Registration <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.dateOfRegistration} placeholder="dateOfRegistration" name="dateOfRegistration" id="dateOfRegistration" maxLength={255} />
                                    </div> 
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Year Of ManuFfacturing</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.yearOfManufacturing} placeholder="yearOfManufacturing" name="yearOfManufacturing" id="yearOfManufacturing" maxLength={10} />
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Manufacturing Company</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.manufacturingCompany} placeholder="Manufacturing Company" name="manufacturingCompany" id="manufacturingCompany" maxLength={10} />
                                    </div> 
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Model</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.model} placeholder="Model" name="model" id="model" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Chasis No</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.chasisNo} placeholder="chasisNo" name="chasisNo" id="chasisNo" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Rc No</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.rcNo} placeholder="rcNo" name="rcNo" id="rcNo" maxLength={255}/>
                                    </div>
                                </div> 
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={vehicleObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Vehicle" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.save}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                        
                        
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Vehicle")}>
                    <i className="fa fa-plus-circle"></i> Add New Vehicle
                </button>
                {
                    vehicleList !== null && vehicleList !== undefined && vehicleList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                    <th> ID</th>
                                    <th>Vehicle Number</th>
                                    <th>Vehicle Type</th>
                                    <th>Capacity</th>
                                    <th>Contact No</th>
                                    <th>Date Of Registration</th>
                            
                                    <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(vehicleList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Vehicle);