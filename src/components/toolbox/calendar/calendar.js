import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import styles from './calendar.css';

class Calendar extends React.Component {
  constructor(props) {
    super();

    const locale = Array.isArray(props.locale) ? [...props.locale] : [props.locale];
    moment.locale([...locale, 'en']);

    const showingDate =
      (moment(props.date, props.dateFormat).isValid() && moment(props.date, props.dateFormat))
      || moment();
    this.state = {
      showingDate,
      selectedDate: showingDate.clone(),
    };

    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.shouldSetShowing = this.shouldSetShowing.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  generatePlaceholder(count, day) {
    return [...Array(count)].map((_, d) => {
      const result = <button key={d} disabled={true} className={styles.day}>{day.format('DD')}</button>;
      day.add(1, 'days');
      return result;
    });
  }

  shouldSetShowing(nextProps) {
    const { dateFormat } = nextProps;
    const minDate = moment(nextProps.minDate, dateFormat);
    const maxDate = moment(nextProps.maxDate, dateFormat);
    const updateTo = (minDate.isValid() && this.state.showingDate < minDate && 'min')
      || (maxDate.isValid() && this.state.showingDate > maxDate && 'max')
      || false;
    if (updateTo) {
      const showingDate = moment(nextProps[`${updateTo}Date`], dateFormat);
      this.setState({ showingDate });
      return false;
    }
    return true;
  }

  shouldComponentUpdate(nextProps) {
    const { dateFormat } = nextProps;
    const selectedDate =
      (moment(nextProps.date, dateFormat).isValid()
        && moment(nextProps.date, dateFormat))
      || this.state.selectedDate.clone();

    if (selectedDate.format(dateFormat)
      !== this.state.selectedDate.format(dateFormat)) {
      this.setState({ selectedDate, showingDate: selectedDate.clone() });
    }
    return this.shouldSetShowing(nextProps);
  }

  previousMonth() {
    const showingDate = this.state.showingDate.subtract(1, 'month');
    this.setState({
      showingDate,
    });
  }

  nextMonth() {
    const showingDate = this.state.showingDate.add(1, 'month');
    this.setState({
      showingDate,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleSelectDate({ target }) {
    const selectedDate = moment(target.value, this.props.dateFormat);
    this.setState({ selectedDate });
    this.props.onDateSelected(target.value);
  }

  render() {
    const locale = Array.isArray(this.props.locale) ? [...this.props.locale] : [this.props.locale];
    moment.locale([...locale, 'en']);
    const { dateFormat } = this.props;
    const { showingDate, selectedDate } = this.state;
    const day = moment(showingDate).startOf('month');

    return (
      <section className={styles.calendarWrapper}>
        <header className={styles.calendarHeader}>
          <span className={styles.navigationButton} onClick={this.previousMonth} />
          <span className={styles.monthName}>{showingDate.format('MMMM')}</span>
          <span className={styles.navigationButton} onClick={this.nextMonth} />
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.monthHeader}>
            {moment.weekdaysShort(true).map((weekday, key) =>
              <div className={styles.weekday} key={key}>{weekday}</div>)}
          </div>
          <div className={styles.month}>
          { this.generatePlaceholder(day.weekday(), day.subtract(day.weekday(), 'days')) }
          { [...Array(day.daysInMonth())].map((_, d) => {
            day.date(d + 1);
            const minDate = moment(this.props.minDate, dateFormat);
            const maxDate = moment(this.props.maxDate, dateFormat);
            const selected = day.format(dateFormat) === selectedDate.format('DD.MM.YY');
            const isDisabled = (minDate.isValid() && day < minDate)
            || (maxDate.isValid() && day > maxDate) || false;
            return <button key={d}
              onClick={this.handleSelectDate}
              value={day.format(dateFormat)}
              disabled={isDisabled}
              className={`${styles.day} ${selected ? styles.selected : ''}`}>
                {day.format('D')}
              </button>;
          })}
          { this.generatePlaceholder(6 - day.weekday(), day.add(1, 'days')) }
          </div>
        </div>
      </section>
    );
  }
}

Calendar.propTypes = {
  locale: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  date: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  onDateSelected: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

Calendar.defaultProps = {
  locale: 'en',
  date: moment().format('DD.MM.YY'),
  dateFormat: 'DD.MM.YY',
  minDate: '',
  maxDate: '',
};

export default Calendar;
