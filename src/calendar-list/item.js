import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Calendar from '../calendar';
import styleConstructor from './style';

class CalendarListItem extends Component {
  static defaultProps = {
    hideArrows: true,
    hideExtraDays: true,
    minYear: 1950,
    maxYear: 2100,
  };

  state = {
    showYearView: false,
  }

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showYearView !== nextState.showYearView) {
      return true;
    }
    const r1 = this.props.item;
    const r2 = nextProps.item;
    return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || !!(r2.propbump && r2.propbump !== r1.propbump);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.showYearView !== this.state.showYearView && this.state.showYearView) {
      const offset = (new Date().getFullYear() - this.props.minYear - 8) * ITEM_HEIGHT;
      this.yearList.scrollToOffset({ offset: offset, animated: true });
    }
  };

  renderYear = ({ item }) => {
    const { onPressYear } = this.props;
    return (
      <TouchableOpacity
        onPress={() => { this.setState({ showYearView: false }); onPressYear && onPressYear(item) }} style={styles.item}>
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderYearView = () => {
    if (!this.state.showYearView) {
      return null;
    }
    let data = [];
    for (let i = this.props.minYear; i <= this.props.maxYear; i++) {
      data.push(i);
    }
    return (
      <View style={[StyleSheet.absoluteFill, styles.yearContainer]}>
        <FlatList
          getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          initialNumToRender={100}
          ref={r => this.yearList = r}
          data={data}
          keyExtractor={item => String(item)}
          renderItem={this.renderYear}
        />
      </View>
    )
  }

  render() {
    const row = this.props.item;
    if (row.getTime) {
      return (
        <View>
          <Calendar
            theme={this.props.theme}
            style={[{ height: this.props.calendarHeight, width: this.props.calendarWidth }, this.style.calendar]}
            current={row}
            hideArrows={this.props.hideArrows}
            hideExtraDays={this.props.hideExtraDays}
            disableMonthChange
            markedDates={this.props.markedDates}
            markingType={this.props.markingType}
            hideDayNames={this.props.hideDayNames}
            onDayPress={this.props.onDayPress}
            onDayLongPress={this.props.onDayLongPress}
            displayLoadingIndicator={this.props.displayLoadingIndicator}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            firstDay={this.props.firstDay}
            monthFormat={this.props.monthFormat}
            dayComponent={this.props.dayComponent}
            disabledByDefault={this.props.disabledByDefault}
            showWeekNumbers={this.props.showWeekNumbers}
            onMonthPress={() => this.setState({ showYearView: true })}
          />
          {
            this.renderYearView()
          }
        </View>
      );
    } else {
      const text = row.toString();
      return (
        <View style={[{ height: this.props.calendarHeight, width: this.props.calendarWidth }, this.style.placeholder]}>
          <Text allowFontScaling={false} style={this.style.placeholderText}>{text}</Text>
        </View>
      );
    }
  }
}

export default CalendarListItem;

const ITEM_HEIGHT = 50;

const styles = StyleSheet.create({
  yearContainer: {
    backgroundColor: '#FFF',
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  }
})