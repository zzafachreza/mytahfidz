import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
  RefreshControl,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {storeData, getData} from '../../utils/localStorage';
import {Icon} from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import MyTerbaik from '../../components/MyTerbaik';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import 'intl';
import 'intl/locale-data/jsonp/en';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default function Home({navigation}) {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('');
  const [point, setPoint] = useState(0);

  const [company, setCompany] = useState({});

  const [refreshing, setRefreshing] = React.useState(false);

  const getDataPoint = () => {
    getData('user').then(res => {
      setUser(res);
      axios
        .post('https://zavalabs.com/mytahfidz//api/point.php', {
          id_member: res.id,
        })
        .then(respoint => {
          setPoint(respoint.data);
          console.log('get apoint', respoint.data);
        });

      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post('https://zavalabs.com/mytahfidz//api/update_token.php', {
            id_member: user.id,
            token: res.token,
          })
          .then(res => {
            console.log('update token', res);
          });
      });
    });
  };

  const DataKategori = ({icon, nama, onPress}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: colors.white,
          padding: 5,
          borderRadius: 10,
          width: windowWidth / 4.5,
          elevation: 5,
        }}>
        <View>
          <Icon
            type="ionicon"
            name={icon}
            color={colors.primary}
            size={windowWidth / 10}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.black,
              fontSize: windowWidth / 34,
              textAlign: 'center',
            }}>
            {nama}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const GetCompany = () => {
    axios.get('https://zavalabs.com/mytahfidz//api/company.php').then(res => {
      console.log('data company', res.data);
      setCompany(res.data);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataPoint();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  messaging().onMessage(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    const json = JSON.stringify(remoteMessage);
    const obj = JSON.parse(json);
    getDataPoint();
  });

  useEffect(() => {
    getDataPoint();
    GetCompany();
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;
  const _renderItem = ({item, index}) => {
    return (
      <Image
        resizeMode="contain"
        source={{uri: item.image}}
        style={{
          width: windowWidth,
          height: Math.round((windowWidth * 9) / 16),
        }}
      />
    );
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        // backgroundColor: colors.primary,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }>
        <View
          style={{
            height: windowHeight / 7,
            padding: 10,
            backgroundColor: colors.primary,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, paddingTop: 15}}>
            <Text
              style={{
                fontSize: windowWidth / 20,
                color: colors.white,
                fontFamily: fonts.secondary[400],
              }}>
              Selamat datang,
            </Text>
            <Text
              style={{
                fontSize: windowWidth / 18,
                color: colors.white,
                fontFamily: fonts.secondary[600],
              }}>
              {user.nama_lengkap}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: 'red',
                width: windowWidth / 5,
                height: windowWidth / 5,
                borderRadius: 50,
                overflow: 'hidden',
              }}>
              <Image
                source={require('../../assets/logo.png')}
                style={{
                  width: windowWidth / 5,
                  height: windowWidth / 5,
                }}
              />
            </View>
          </View>
        </View>

        {/* bagian untuk search */}

        <View
          style={{
            padding: 10,
            backgroundColor: colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                color: colors.black,
                fontSize: windowWidth / 25,
              }}>
              Markaz Tahfidz Roudhotul Muhibbin
            </Text>
          </View>
        </View>
        <MyCarouser />

        <View
          style={{
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon type="ionicon" name="grid" color={colors.primary} />
            <Text
              style={{
                fontFamily: fonts.secondary[800],
                color: colors.black,
                left: 10,
              }}>
              KATEGORI
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() => navigation.navigate('Daftar')}
              icon="bookmarks"
              nama="Pendaftaran Santri"
            />
            <DataKategori
              onPress={() => navigation.navigate('Info')}
              icon="information-circle"
              nama="Informasi"
            />
            <DataKategori
              onPress={() => navigation.navigate('Tahsin')}
              icon="logo-youtube"
              nama="Tahsin Online"
            />
            <DataKategori
              onPress={() => navigation.navigate('Beasiswa')}
              icon="grid"
              nama="Beasiswa Pendidikan"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() => navigation.navigate('Zakat')}
              icon="wallet"
              nama="Zakat Infaq Shodaqoh"
            />
            <DataKategori
              onPress={() => navigation.navigate('Waqaf')}
              icon="cube"
              nama="Waqaf Pembangunan"
            />
            <DataKategori
              onPress={() => navigation.navigate('Buku')}
              icon="download"
              nama="Download E-book"
            />
            <DataKategori
              onPress={() => navigation.navigate('Gallery')}
              icon="images"
              nama="Gallery Tahfidz"
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
