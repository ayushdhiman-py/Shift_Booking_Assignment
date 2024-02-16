import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const Shift = ({id, startTime, endTime, area, onCancel}) => {
  const start = new Date(startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const end = new Date(endTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const shiftStarted = new Date() > new Date(startTime);

  return (
    <View style={styles.shiftContainer}>
      <View style={styles.container}>
        <Text style={styles.shiftText}>{`${start} - ${end}`}</Text>
        <Text style={styles.areaText}>{`${area}`}</Text>
      </View>
      <TouchableOpacity
        onPress={() => !shiftStarted && onCancel(id)}
        style={[styles.cancelBtn, shiftStarted && styles.disabledBtn]}
        disabled={shiftStarted}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const MyShifts = () => {
  const [shifts, setShifts] = useState([]);

  const fetchMyShifts = () => {
    fetch('http://127.0.0.1:8080/shifts')
      .then(response => response.json())
      .then(data => {
        const bookedShifts = data.filter(shift => shift.booked);
        const shiftsByDate = bookedShifts.reduce((groups, shift) => {
          const date = new Date(shift.date).toDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(shift);
          return groups;
        }, {});
        const sections = Object.keys(shiftsByDate).map(date => ({
          title: date,
          data: shiftsByDate[date],
        }));
        setShifts(sections);
      })
      .catch(error => console.error('Error fetching shifts:', error));
  };

  useEffect(() => {
    fetchMyShifts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMyShifts();
    }, []),
  );

  const cancelShift = id => {
    fetch(`http://127.0.0.1:8080/shifts/${id}/cancel`, {method: 'POST'})
      .then(response => {
        if (response.ok) {
          fetchMyShifts();
        } else if (response.status === 404) {
          throw new Error(`Shift not found with ID ${id}`);
        } else if (response.status === 400) {
          throw new Error(`Cannot cancel shift ${id} that is not booked`);
        } else {
          throw new Error('Server response is not OK');
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
        console.error('Error cancelling shift:', error);
      });
  };

  const renderSectionHeader = ({section: {title}}) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let displayDate = '';
    if (title === today.toDateString()) {
      displayDate = 'TODAY';
    } else if (title === tomorrow.toDateString()) {
      displayDate = 'TOMORROW';
    } else {
      displayDate = title;
    }
    return <Text style={styles.sectionHeader}>{displayDate}</Text>;
  };

  return (
    <View style={styles.container}>
      {shifts.length > 0 ? (
        <SectionList
          sections={shifts}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <Shift {...item} onCancel={cancelShift} />}
          renderSectionHeader={renderSectionHeader}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noShiftsText}>! YOU ARE FREE TODAY !</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    backgroundColor: '#F1F4F8',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F6C92',
    padding: 10,
  },
  shiftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  shiftText: {
    fontSize: 18,
    color: '#4F6C92',
  },
  cancelBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderColor: '#FE93B3',
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#E2006A',
    fontSize: 18,
  },
  areaText: {
    color: '#A4B8D3',
    fontSize: 19,
  },
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: '#CBD2E1',
  },
  noShiftsText: {
    color: 'black',
  },
});

export default MyShifts;
