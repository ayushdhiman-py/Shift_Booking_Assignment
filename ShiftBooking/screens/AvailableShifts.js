import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';

const Shift = ({id, startTime, endTime, area, onBook}) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  const isShiftActive = now >= start && now <= end;
  const isShiftOver = now > end;

  const startDisplay = start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endDisplay = end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.shiftContainer}>
      <View style={styles.container}>
        <Text
          style={styles.shiftText}>{`${startDisplay} - ${endDisplay}`}</Text>
        <Text style={styles.areaText}>{`${area}`}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onBook(id)}
        style={[
          styles.bookBtn,
          isShiftActive || isShiftOver ? {borderColor: 'grey'} : {},
        ]}
        disabled={isShiftActive || isShiftOver}>
        <Text
          style={[
            styles.bookText,
            isShiftActive || isShiftOver ? {color: 'grey'} : {},
          ]}>
          Book
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AvailableShifts = () => {
  const [availableShifts, setAvailableShifts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  const fetchAvailableShifts = () => {
    fetch('http://127.0.0.1:8080/shifts')
      .then(response => response.json())
      .then(data => {
        const filteredShifts = data.filter(shift => !shift.booked);
        const shiftsByDate = filteredShifts.reduce((groups, shift) => {
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
        setAvailableShifts(sections);

        const uniqueAreas = Array.from(
          new Set(filteredShifts.map(shift => shift.area)),
        );
        setAreas(uniqueAreas);
      })
      .catch(error => console.error('Error fetching available shifts:', error));
  };

  useEffect(() => {
    fetchAvailableShifts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAvailableShifts();
    }, []),
  );

  const bookShift = id => {
    fetch(`http://127.0.0.1:8080/shifts/${id}/book`, {method: 'POST'})
      .then(response => {
        if (response.ok) {
          fetchAvailableShifts();
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .catch(error => {
        let errorMsg = 'An error occurred';
        if (error.message === '404') {
          errorMsg = `Shift not found with ID ${id}`;
        } else if (error.message === '400') {
          errorMsg = `Shift ${id} is already booked`;
        } else if (error.message === '403') {
          errorMsg = 'Shift is already finished';
        } else if (error.message === '401') {
          errorMsg = 'Shift has already started';
        } else if (error.message === '409') {
          errorMsg = 'Cannot book an overlapping shift';
        }
        Alert.alert('Error', errorMsg);
      });
  };

  const renderSectionHeader = ({section: {title, data}}) => {
    const date = new Date(title);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let displayDate = '';
    if (date.toDateString() === today.toDateString()) {
      displayDate = 'TODAY';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      displayDate = 'TOMORROW';
    } else {
      displayDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }

    const totalShifts = data.length;
    const totalHours = data.reduce((total, shift) => {
      const hours = (shift.endTime - shift.startTime) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    return (
      <Text style={styles.sectionHeader}>
        {`${displayDate}   `}
        <Text style={{fontSize: 16, color: '#A4B8D3'}}>
          {`${totalShifts} Shifts, ${Math.round(totalHours)} Hours`}
        </Text>
      </Text>
    );
  };

  const filteredShifts = selectedArea
    ? availableShifts.filter(section =>
        section.data.some(shift => shift.area === selectedArea),
      )
    : availableShifts;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedArea}
        onValueChange={itemValue => setSelectedArea(itemValue)}
        style={{height: 50, width: '150', backgroundColor: '#16A64D'}}>
        <Picker.Item label="Select Area " value="" />
        {areas.map((area, index) => (
          <Picker.Item key={index} label={area} value={area} />
        ))}
      </Picker>

      {filteredShifts.length === 0 ? (
        <Text style={styles.noShiftsText}>No available shifts.</Text>
      ) : (
        <SectionList
          sections={filteredShifts}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({item}) => <Shift {...item} onBook={bookShift} />}
          renderSectionHeader={renderSectionHeader}
        />
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
    fontSize: 18,
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
  bookBtn: {
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderColor: '#4CAF50',
    borderWidth: 1,
    alignItems: 'center',
  },
  bookText: {
    color: '#4CAF50',
    fontSize: 18,
  },
  areaText: {
    color: '#A4B8D3',
    fontSize: 19,
  },
  noShiftsText: {
    fontSize: 20,
    textAlign: 'center',
    top: '42%',
    color: '#4F6C92',
  },
});

export default AvailableShifts;
