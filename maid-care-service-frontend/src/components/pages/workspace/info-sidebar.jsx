import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, VStack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { workspace } from '../../../api';
import { useStores } from '../../../hooks/use-stores';
import FlexBox from '../../shared/FlexBox';
import { TextInputField } from '../../shared/FormikField';
import SearchLocation from './search-location';
import WorkspaceButton from './workspace-btn';
import { useToast } from '@chakra-ui/react';

const InfoSidebar = observer(({ panTo, markers, setMarkers }) => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const { userStore } = useStores();
  const [isOpen, setIsOpen] = useState(false);

  const user = userStore.userData;
  const toast = useToast();

  const yup = Yup.object({
    houseNo: Yup.string().required('please fill your house No.'),
    address1: Yup.string().required('please fill your address'),
    city: Yup.string().required('please fill your city.'),
    state: Yup.string().required('please select your state/province.'),
  });

  const toastMarkersEmpty = () => {
    toast({
      title: 'Warning',
      description: "Please drop a pin on the map.",
      status: 'warning',
      duration: 9000,
      isClosable: true,
    });
  };

  const toastWorkspaceSuccess = () => {
    toast({
      title: 'Success',
      description: "The system has added your new workspace",
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const toastWorkspaceFail = () => {
    toast({
      title: 'System fail',
      description: "Please try again",
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  };

  const postWorkspace = ( {description} ) => {
    workspace
      .post('/', {
        customerId: user._id,
        description: description,
        latitude: markers[0].lat,
        longitude: markers[0].lng,
      })
      .then(response => {
        console.log(response);
        toastWorkspaceSuccess();
      })
      .catch(error => {
        console.error(error);
        toastWorkspaceFail();
        setError(error);
      });
  }


  const handleSubmit = () => {
    if (markers.length === 0){
      toastMarkersEmpty();
    }
    else {
      setIsOpen(true);
    }

  };

  return (
    <FlexBox>
      <VStack spacing="20x" h="850px" w="100%">
        <Box fontSize="3xl" mb="15px" fontWeight="extrabold">
          New workspace
        </Box>
        <SearchLocation panTo={panTo} setMarkers={setMarkers} />
        <Formik
          initialValues={{
            houseNo: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
          }}
          validationSchema={yup}
          onSubmit={handleSubmit}>
          <Form>
            <Box pos="relative"  width="100%" alignItems="center">
              <FormControl id="country" width={{ sm: '270px', md: '368px' }}>
                <TextInputField label="House NO." placeholder="Text Here" name="houseNo" />
                <TextInputField label="Address 1" name="address1" placeholder="Text Here" />
                <TextInputField placeholder="Text Here" label="Address 2" name="address2" />
                <TextInputField placeholder="Text Here" label="City" name="city" />
                <FormLabel mb="0" fontWeight="bold">
                  State / Province
                </FormLabel>
                <TextInputField as={Select} defaultValue="" name="state" mb="15px">
                  <option value="">--------- เลือกจังหวัด ---------</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="กระบี่">กระบี่ </option>
                  <option value="กาญจนบุรี">กาญจนบุรี </option>
                  <option value="กาฬสินธุ์">กาฬสินธุ์ </option>
                  <option value="กำแพงเพชร">กำแพงเพชร </option>
                  <option value="ขอนแก่น">ขอนแก่น</option>
                  <option value="จันทบุรี">จันทบุรี</option>
                  <option value="ฉะเชิงเทรา">ฉะเชิงเทรา </option>
                  <option value="ชัยนาท">ชัยนาท </option>
                  <option value="ชัยภูมิ">ชัยภูมิ </option>
                  <option value="ชุมพร">ชุมพร </option>
                  <option value="ชลบุรี">ชลบุรี </option>
                  <option value="เชียงใหม่">เชียงใหม่ </option>
                  <option value="เชียงราย">เชียงราย </option>
                  <option value="ตรัง">ตรัง </option>
                  <option value="ตราด">ตราด </option>
                  <option value="ตาก">ตาก </option>
                  <option value="นครนายก">นครนายก </option>
                  <option value="นครปฐม">นครปฐม </option>
                  <option value="นครพนม">นครพนม </option>
                  <option value="นครราชสีมา">นครราชสีมา </option>
                  <option value="นครศรีธรรมราช">นครศรีธรรมราช </option>
                  <option value="นครสวรรค์">นครสวรรค์ </option>
                  <option value="นราธิวาส">นราธิวาส </option>
                  <option value="น่าน">น่าน </option>
                  <option value="นนทบุรี">นนทบุรี </option>
                  <option value="บึงกาฬ">บึงกาฬ</option>
                  <option value="บุรีรัมย์">บุรีรัมย์</option>
                  <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์ </option>
                  <option value="ปทุมธานี">ปทุมธานี </option>
                  <option value="ปราจีนบุรี">ปราจีนบุรี </option>
                  <option value="ปัตตานี">ปัตตานี </option>
                  <option value="พะเยา">พะเยา </option>
                  <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา </option>
                  <option value="พังงา">พังงา </option>
                  <option value="พิจิตร">พิจิตร </option>
                  <option value="พิษณุโลก">พิษณุโลก </option>
                  <option value="เพชรบุรี">เพชรบุรี </option>
                  <option value="เพชรบูรณ์">เพชรบูรณ์ </option>
                  <option value="แพร่">แพร่ </option>
                  <option value="พัทลุง">พัทลุง </option>
                  <option value="ภูเก็ต">ภูเก็ต </option>
                  <option value="มหาสารคาม">มหาสารคาม </option>
                  <option value="มุกดาหาร">มุกดาหาร </option>
                  <option value="แม่ฮ่องสอน">แม่ฮ่องสอน </option>
                  <option value="ยโสธร">ยโสธร </option>
                  <option value="ยะลา">ยะลา </option>
                  <option value="ร้อยเอ็ด">ร้อยเอ็ด </option>
                  <option value="ระนอง">ระนอง </option>
                  <option value="ระยอง">ระยอง </option>
                  <option value="ราชบุรี">ราชบุรี</option>
                  <option value="ลพบุรี">ลพบุรี </option>
                  <option value="ลำปาง">ลำปาง </option>
                  <option value="ลำพูน">ลำพูน </option>
                  <option value="เลย">เลย </option>
                  <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                  <option value="สกลนคร">สกลนคร</option>
                  <option value="สงขลา">สงขลา </option>
                  <option value="สมุทรสาคร">สมุทรสาคร </option>
                  <option value="สมุทรปราการ">สมุทรปราการ </option>
                  <option value="สมุทรสงคราม">สมุทรสงคราม </option>
                  <option value="สระแก้ว">สระแก้ว </option>
                  <option value="สระบุรี">สระบุรี </option>
                  <option value="สิงห์บุรี">สิงห์บุรี </option>
                  <option value="สุโขทัย">สุโขทัย </option>
                  <option value="สุพรรณบุรี">สุพรรณบุรี </option>
                  <option value="สุราษฎร์ธานี">สุราษฎร์ธานี </option>
                  <option value="สุรินทร์">สุรินทร์ </option>
                  <option value="สตูล">สตูล </option>
                  <option value="หนองคาย">หนองคาย </option>
                  <option value="หนองบัวลำภู">หนองบัวลำภู </option>
                  <option value="อำนาจเจริญ">อำนาจเจริญ </option>
                  <option value="อุดรธานี">อุดรธานี </option>
                  <option value="อุตรดิตถ์">อุตรดิตถ์ </option>
                  <option value="อุทัยธานี">อุทัยธานี </option>
                  <option value="อุบลราชธานี">อุบลราชธานี</option>
                  <option value="อ่างทอง">อ่างทอง </option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </TextInputField>
                <TextInputField
                  mb="15px"
                  placeholder="Text Here"
                  label="Country"
                  name="country"
                  value="ประเทศไทย"
                />
              </FormControl>
              <WorkspaceButton isOpen={isOpen} setIsOpen={setIsOpen} postWorkspace={postWorkspace}/>
            </Box>
          </Form>
        </Formik>
      </VStack>
    </FlexBox>
  );
});

export default InfoSidebar;
