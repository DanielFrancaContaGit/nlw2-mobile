import  React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './style';

function Favorites() {  
  const [favorites, setFavorites] = useState([]);

  async function loadingFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        setFavorites(favoritedTeachers);
      };
    });
  }

  useFocusEffect(() => {
    loadingFavorites();
  });
  
  return(
    <View style={styles.container}>
      <PageHeader title='Meus proffys favoritos'/>

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        { favorites.map((teacher: Teacher ) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Favorites;