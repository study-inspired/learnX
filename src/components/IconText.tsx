import React from 'react';
import {View, StyleSheet} from 'react-native';
import {iOSUIKit} from 'react-native-typography';
import {IconProps} from 'react-native-vector-icons/Icon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from './Text';

export type IIconTextProps = IconProps & {
  text: string;
};

const IconText: React.FunctionComponent<IIconTextProps> = props => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon size={iOSUIKit.bodyObject.fontSize} {...props} />
      <Text
        style={StyleSheet.compose(iOSUIKit.body, {
          marginLeft: 5,
          color: props.color,
        })}>
        {props.text}
      </Text>
    </View>
  );
};

export default IconText;
