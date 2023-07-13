/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  Linking,
  TextInput,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [isNext, setIsNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState({});

  const getCats = () => {
    setIsLoading(true);
    const api_key =
      'live_Irm1Bi3uidbOjCDZxcj18IdhHquytAPujABnh76h5LZMJyXP7QFV10woPiYyLjx0';
    axios
      .get(
        `https://api.thecatapi.com/v1/breeds?page=${currentPage}&limit=10&api_key=${api_key}`,
      )
      .then(res => {
        setIsSuccess(true);
        setCats([...cats, ...res.data]);
        setIsNext(true);
        setIsLoading(false);
        if (res.data.length === 0) {
          setIsNext(false);
          setIsLoading(false);
        }
      })
      .catch(err => console.log(err));
  };

  const loadMore = () => {
    return isNext ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffcd61" />
      </View>
    ) : (
      <Text style={styles.end}>No more data</Text>
    );
  };

  // Fungsi untuk mencari breeds berdasarkan breeds_id
  const searchCats = () => {
    setIsLoading(true);
    if (keyword !== '') {
      const api_key =
        'live_Irm1Bi3uidbOjCDZxcj18IdhHquytAPujABnh76h5LZMJyXP7QFV10woPiYyLjx0';
      axios
        .get(
          `https://api.thecatapi.com/v1/images/search?breed_ids=${keyword}&api_key=${api_key}`,
        )
        .then(res => {
          console.log('DATA RES: ', res.data[0].breeds);
          setSearchResult({
            ...searchResult,
            data: res.data[0].breeds,
            image: res.data[0].url,
          });
          setIsLoading(false);
          setIsSuccess(true);

          if (isNext) {
            setIsNext(false);
          }
        })
        .catch(error => console.log(error));
    } else {
      setIsLoading(false);
      setIsSuccess(true);
      getCats();
    }
  };

  useEffect(() => {
    getCats();

    return () => getCats();
  }, [currentPage]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={[
          styles.content,
          {
            backgroundColor: isDarkMode ? Colors.black : '#dce2f5',
          },
        ]}>
        <Text
          style={[
            styles.title,
            {
              color: isDarkMode ? Colors.light : '#2e3138',
            },
          ]}>
          CATPEDIA
        </Text>
        <View style={styles.searchWrapper}>
          <Icon name="magnify" size={20} />
          <TextInput
            style={styles.search}
            placeholder="Search"
            value={keyword}
            onChangeText={text => setKeyword(text)}
            onSubmitEditing={searchCats}
          />
        </View>

        {Object.keys(searchResult).length > 0 ||
        (cats.length > 0 && isSuccess) ? (
          <FlatList
            data={
              Object.keys(searchResult).length > 0 ? searchResult.data : cats
            }
            showsVerticalScrollIndicator={false}
            renderItem={({item: cat, index}) => {
              let starAdapt = cat.adaptability;
              let starAffect = cat.affection_level;
              let starHealth = cat.health_issues;
              let starEnergy = cat.energy_level;
              let starIntelligence = cat.intelligence;
              let starsAdapt = [];
              let starsAffect = [];
              let starsHealth = [];
              let starsEnergy = [];
              let starsIntelligence = [];
              for (let i = 1; i <= 5; i++) {
                starsAdapt.push(
                  <Icon
                    name={i <= starAdapt ? 'star' : 'star-outline'}
                    color="#ffcd61"
                    size={12}
                    key={i}
                  />,
                );
              }
              for (let i = 1; i <= 5; i++) {
                starsAffect.push(
                  <Icon
                    name={i <= starAffect ? 'star' : 'star-outline'}
                    color="#ffcd61"
                    size={12}
                    key={i}
                  />,
                );
              }
              for (let i = 1; i <= 5; i++) {
                starsHealth.push(
                  <Icon
                    name={i <= starHealth ? 'star' : 'star-outline'}
                    color="#ffcd61"
                    size={12}
                    key={i}
                  />,
                );
              }
              for (let i = 1; i <= 5; i++) {
                starsEnergy.push(
                  <Icon
                    name={i <= starEnergy ? 'star' : 'star-outline'}
                    color="#ffcd61"
                    size={12}
                    key={i}
                  />,
                );
              }
              for (let i = 1; i <= 5; i++) {
                starsIntelligence.push(
                  <Icon
                    name={i <= starIntelligence ? 'star' : 'star-outline'}
                    color="#ffcd61"
                    size={12}
                    key={i}
                  />,
                );
              }
              return (
                <View style={styles.card}>
                  <View style={styles.wrapper}>
                    {searchResult.length > 0 ? (
                      <Text>Search</Text>
                    ) : (
                      <Image
                        source={
                          cat?.image?.url
                            ? {uri: cat?.image?.url}
                            : searchResult.image
                            ? {uri: searchResult.image}
                            : require('../assets/cat.png')
                        }
                        style={styles.catImage}
                        onError={() => {}}
                      />
                    )}
                    <View style={styles.subWrapper}>
                      <Text style={styles.name}>{cat.name}</Text>
                      <View style={styles.highlight}>
                        <Text style={styles.origin}>{cat.origin}</Text>
                      </View>
                      <Text
                        style={[
                          styles.text,
                          {
                            fontWeight: 600,
                          },
                        ]}>
                        Life Span :{' '}
                        <Text style={{fontWeight: 'normal'}}>
                          {cat.life_span} years
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.detailContainer}
                    onPress={() => {
                      setCurrentIndex(index === currentIndex ? null : index);
                    }}>
                    <View style={styles.cardDetails}>
                      <Text style={styles.detail}>Details</Text>
                      {index === currentIndex && (
                        <View style={[styles.contentDetail]}>
                          <Text style={{textAlign: 'justify'}}>
                            {cat.description}
                          </Text>
                          <Text style={{fontWeight: '500', marginVertical: 4}}>
                            Temperament:{' '}
                            <Text style={{fontStyle: 'italic'}}>
                              {cat.temperament}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontWeight: '500',
                              marginBottom: 2,
                            }}>
                            Adaptability {starsAdapt}
                          </Text>
                          <Text style={{fontWeight: '500', marginBottom: 2}}>
                            Intelligence {starsIntelligence}
                          </Text>
                          <Text style={{fontWeight: '500', marginBottom: 2}}>
                            Energy Level {starsEnergy}
                          </Text>
                          <Text style={{fontWeight: '500', marginBottom: 2}}>
                            Affection Level {starsAffect}
                          </Text>
                          <Text style={{fontWeight: '500', marginBottom: 2}}>
                            Health Issues {starsHealth}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 8,
                            }}>
                            <Text style={{marginRight: 10}}>For More Info</Text>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              style={styles.btnWiki}
                              onPress={() =>
                                Linking.openURL(`${cat.wikipedia_url}`)
                              }>
                              <Text style={{color: '#fff'}}>Wikipedia</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={cat => Math.random() + cat.id}
            ListFooterComponent={loadMore}
            ListEmptyComponent={() => {
              <View style={styles.empty}>
                <Text>No data at the moment</Text>
                <Button onPress={() => getCats()} title="Refresh" />
              </View>;
            }}
            onEndReached={() => {
              isNext && setCurrentPage(currentPage + 1);
            }}
            onEndReachedThreshold={0.2}
          />
        ) : (
          <View style={styles.loadWrapper}>
            <Text style={styles.loading}>Loading ....</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    height: height,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingTop: 10,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 2,
    width: 175,
  },
  origin: {
    textAlign: 'center',
    fontSize: 14,
  },
  detailContainer: {
    flexGrow: 1,
  },
  cardDetails: {
    marginTop: 10,
    flexGrow: 1,
    backgroundColor: '#889cdd',
    paddingVertical: 8,
    borderRadius: 6,
  },

  detail: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    color: '#f9f9eb',
  },
  empty: {
    textAlign: 'center',
    fontSize: 15,
  },
  catImage: {
    width: 110,
    height: 110,
    marginRight: 10,
    borderRadius: 6,
  },
  card: {
    minHeight: 140,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subWrapper: {
    flex: 1,
    marginLeft: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#505662',
  },
  contentDetail: {
    textAlign: 'justify',
    backgroundColor: '#fff',
    color: '#393939',
    padding: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 10,
    color: '#505662',
  },
  btnWiki: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: '#dd8888',
  },
  loading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#889cdd',
    marginVertical: 'auto',
    marginHorizontal: 'auto',
  },
  loadWrapper: {
    height: height,
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  end: {
    textAlign: 'center',
    fontSize: 16,
    color: '#393939',
    marginVertical: '5%',
  },
  search: {
    height: 35,
    width: width,
    paddingHorizontal: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  refresh: {
    backgroundColor: '#dd8888',
  },
});

export default App;
