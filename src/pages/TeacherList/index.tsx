import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './style';
import api from '../../services/api';


function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeek_day] = useState('');
  const [time, setTime] = useState('');

  function handleToggleFilterVisible() {
    setFiltersVisible(!filtersVisible);
  }

  function loadingFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });
        setFavorites(favoritedTeachersIds);
      };
    });
  }

  
  async function handleFilterSubmit() {
    loadingFavorites();
    const response = await api.get('classes', {
      params: {
        subject,
      week_day,
      time
      }
    })

    setTeachers(response.data);
  }

  return(
    <View style={styles.container}>
      <PageHeader 
        title='Proffys disponíveis' 
        headerRight={(
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name='filter' size={20} color='#FFF' />
          </BorderlessButton>
        )}
      >
        { filtersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matérias</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={Text => setSubject(Text)}
              placeholder='Qual a materia'
              placeholderTextColor='#c1bccc'
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={Text => setWeek_day(Text)}
                  placeholder='Qual o dia ?'
                  placeholderTextColor='#c1bccc'
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={Text => setTime(Text)}
                  placeholder='Qual horário ?'
                  placeholderTextColor='#c1bccc'  
                />
              </View>
            </View>

            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}> 
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          )
        })}
      </ScrollView>
    </View> 
  );
};

export default TeacherList;