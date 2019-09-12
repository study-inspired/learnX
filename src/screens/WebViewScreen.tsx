import React, {useEffect, useState} from 'react';
import {ProgressViewIOS, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {WebView} from 'react-native-webview';
import MediumPlaceholder from '../components/MediumPlaceholder';
import Colors from '../constants/Colors';
import {getTranslation} from '../helpers/i18n';
import {downloadFile, shareFile} from '../helpers/share';
import {showToast} from '../helpers/toast';
import {INavigationScreen} from '../types/NavigationScreen';
import {useDarkMode, initialMode} from 'react-native-dark-mode';

export interface IWebViewScreenStateProps {
  readonly filename: string;
  readonly url: string;
  readonly ext: string;
}

type IWebViewScreenProps = IWebViewScreenStateProps;

const WebViewScreen: INavigationScreen<IWebViewScreenProps> = props => {
  const {url, ext, filename} = props;

  const [loading, setLoading] = useState(true);
  const [filePath, setFilePath] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      (async () => {
        const filePath = await downloadFile(url, filename, ext, setProgress);
        if (filePath) {
          setFilePath(filePath);
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      ({buttonId}) => {
        if (buttonId === 'share') {
          showToast(getTranslation('preparingFile'), 1500);
          shareFile(url, filename, ext);
        }
      },
    );
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDarkMode = useDarkMode();

  useEffect(() => {
    const tabIconDefaultColor = isDarkMode ? Colors.grayDark : Colors.grayLight;
    const tabIconSelectedColor = isDarkMode ? Colors.purpleDark : Colors.theme;

    Navigation.mergeOptions(props.componentId, {
      layout: {
        backgroundColor: isDarkMode ? 'black' : 'white',
      },
      bottomTab: {
        textColor: tabIconDefaultColor,
        selectedTextColor: tabIconSelectedColor,
        iconColor: tabIconDefaultColor,
        selectedIconColor: tabIconSelectedColor,
      },
    });
  }, [isDarkMode, props.componentId]);

  return (
    <>
      <WebView
        source={{
          uri: filePath,
        }}
        originWhitelist={['*']}
        decelerationRate="normal"
      />
      {loading && (
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <MediumPlaceholder style={{margin: 15}} loading={true} />
          <MediumPlaceholder style={{margin: 15}} loading={true} />
          <MediumPlaceholder style={{margin: 15}} loading={true} />
          <MediumPlaceholder style={{margin: 15}} loading={true} />
        </View>
      )}
      {loading && (
        <ProgressViewIOS
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: [{scaleX: 1.0}, {scaleY: 3}],
          }}
          progressTintColor={Colors.theme}
          progress={progress}
        />
      )}
    </>
  );
};

// tslint:disable-next-line: no-object-mutation
WebViewScreen.options = {
  layout: {
    backgroundColor: initialMode === 'dark' ? 'black' : 'white',
  },
  topBar: {
    hideOnScroll: true,
    rightButtons: [
      {
        id: 'share',
        systemItem: 'action',
      },
    ],
  },
};

export default WebViewScreen;
