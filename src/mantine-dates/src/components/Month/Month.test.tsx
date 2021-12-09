import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  itSupportsClassName,
  itSupportsOthers,
  itSupportsStyle,
  itSupportsMargins,
  itSupportsStylesApi,
  itSupportsRef,
} from '@mantine/tests';
import { Month } from './Month';
import { Day } from './Day/Day';
import { Month as MonthStylesApi } from './styles.api';

const defaultProps = { month: new Date(), value: new Date() };

describe('@mantine/core/Month', () => {
  itSupportsStyle(Month, defaultProps);
  itSupportsClassName(Month, defaultProps);
  itSupportsOthers(Month, defaultProps);
  itSupportsMargins(Month, defaultProps);
  itSupportsRef(Month, defaultProps, HTMLTableElement);
  itSupportsStylesApi(
    Month,
    defaultProps,
    Object.keys(MonthStylesApi).filter(
      (key) => key !== 'inRange' && key !== 'firstInRange' && key !== 'lastInRange'
    ),
    'Month'
  );

  it('renders correct amount of weekdays', () => {
    const element = shallow(<Month month={new Date()} />);
    expect(element.render().find('.mantine-Month-weekdayCell')).toHaveLength(7);
  });

  it('renders correct amount of days', () => {
    const element = shallow(<Month month={new Date(2021, 1, 2)} />);
    expect(element.render().find('tbody tr')).toHaveLength(4);
    expect(element.render().find('tbody td')).toHaveLength(28);

    const firstDayOfWeekSunday = shallow(
      <Month month={new Date(2021, 1, 2)} firstDayOfWeek="sunday" />
    );
    expect(firstDayOfWeekSunday.render().find('tbody tr')).toHaveLength(5);
    expect(firstDayOfWeekSunday.render().find('tbody td')).toHaveLength(35);
  });

  it('assigns values to given daysRefs', () => {
    const daysRefs: HTMLButtonElement[][] = [];
    mount(<Month {...defaultProps} month={new Date(2021, 11, 1)} daysRefs={daysRefs} />);
    expect(daysRefs.length).toBe(5);
    expect(daysRefs.every((list) => list.length === 7)).toBe(true);
    expect(daysRefs.every((list) => list.every((date) => date instanceof HTMLButtonElement))).toBe(
      true
    );
  });

  it('adds styles when month days are within range', () => {
    const withoutRange = shallow(<Month month={new Date(2021, 11, 1)} />);
    const withRange = shallow(
      <Month
        month={new Date(2021, 11, 1)}
        range={[new Date(2021, 11, 5), new Date(2021, 11, 15)]}
      />
    );

    expect(withRange.render().find('.mantine-Month-firstInRange')).toHaveLength(1);
    expect(withRange.render().find('.mantine-Month-lastInRange')).toHaveLength(1);
    expect(withRange.render().find('.mantine-Month-inRange')).toHaveLength(11);

    expect(withoutRange.render().find('.mantine-Month-firstInRange')).toHaveLength(0);
    expect(withoutRange.render().find('.mantine-Month-lastInRange')).toHaveLength(0);
    expect(withoutRange.render().find('.mantine-Month-inRange')).toHaveLength(0);
  });

  it('does not add styles when month days outside of range', () => {
    const element = shallow(
      <Month
        month={new Date(2021, 11, 1)}
        range={[new Date(2021, 10, 5), new Date(2021, 10, 15)]}
      />
    );

    expect(element.render().find('.mantine-Month-firstInRange')).toHaveLength(0);
    expect(element.render().find('.mantine-Month-lastInRange')).toHaveLength(0);
    expect(element.render().find('.mantine-Month-inRange')).toHaveLength(0);
  });

  it('adds partial range styles', () => {
    const element = shallow(
      <Month
        month={new Date(2021, 11, 1)}
        range={[new Date(2021, 11, 25), new Date(2021, 12, 15)]}
      />
    );

    expect(element.render().find('.mantine-Month-firstInRange')).toHaveLength(1);
    expect(element.render().find('.mantine-Month-lastInRange')).toHaveLength(0);
    expect(element.render().find('.mantine-Month-inRange')).toHaveLength(9);
  });

  it('prevents day focus when preventFocus is true', () => {
    const preventFocusSpy = jest.fn();
    const defaultFocusSpy = jest.fn();

    const preventFocus = shallow(<Month {...defaultProps} preventFocus />);
    const defaultFocus = shallow(<Month {...defaultProps} preventFocus={false} />);

    preventFocus.find(Day).at(0).simulate('mousedown', { preventDefault: preventFocusSpy });
    defaultFocus.find(Day).at(0).simulate('mousedown', { preventDefault: defaultFocusSpy });

    expect(preventFocusSpy).toHaveBeenCalledTimes(1);
    expect(defaultFocusSpy).toHaveBeenCalledTimes(0);
  });

  it('has correct displayName', () => {
    expect(Month.displayName).toEqual('@mantine/core/Month');
  });
});
