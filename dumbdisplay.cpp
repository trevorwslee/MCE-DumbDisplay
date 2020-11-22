#include "pxt.h"
#include "MESEvents.h"
#include "MicroBitUARTService.h"



#define ENABLE_BLUETOOTH
#define ENABLE_SERIAL


#define DEBUG false


#define LOG_TO_SERIAL false

#define LOG_TO_SERIAL_LEDS false
#define LOG_TO_SERIAL_EX DEBUG
#define LOG_TO_SERIAL_EX_2 DEBUG

//#define SERIAL_BAUD_RATE 115200


// *** it appears ASYNC will cause something to be missing
//#define ASYNC_LE_SEND


// *** NO_CONCURRENT_SEND_COMMAND must always be defined
#define NO_CONCURRENT_SEND_COMMAND


// max LE Buffer Size seems to be 20
#define LE_RECEIVE_BUFER_SIZE 8
//#define LE_WAIT_SEND_BUFFER_SIZE 8
#define LE_WAIT_SEND_BUFFER_SIZE 10
#define SEND_COMMAND_BUFFER_SIZE 2 * LE_WAIT_SEND_BUFFER_SIZE   

#define EVENT_SENT_COMMAND 99
// -- MICROBIT_DISPLAY_EVT_FREE           1
// -- MICROBIT_SERIAL_EVT_TX_EMPTY        2
// -- MICROBIT_UART_S_EVT_TX_EMPTY        3

using namespace pxt;


namespace DumbDisplayCpp {

    const uint8_t BufferSize = SEND_COMMAND_BUFFER_SIZE;

    const uint8_t LeReceiveBufferSize = LE_RECEIVE_BUFER_SIZE;
    const uint8_t LeSendBufferSize = BufferSize;

    const uint8_t SerialReceiveBufferSize = 2* LeReceiveBufferSize;
    const uint8_t SerialSendBufferSize = 2 * LeSendBufferSize;

    char buffer[BufferSize + 1];
    uint8_t bufferOffset = 0;

    Action _onConnect = NULL;
    Action _onDisconnect = NULL;
    Action _onReceive = NULL;
 
    MicroBitUARTService *uart = NULL;

    volatile bool _leConnected = false;
    volatile bool _serialConnected = false;
    volatile uint8_t _sender = 0;
    uint8_t _param_count = 0;

    //%
    bool getConnected() { return _leConnected || _serialConnected;  }

    inline void __sendDataPiece(const char *dataPiece, uint8_t dataPieceLen) {
        if (LOG_TO_SERIAL || _serialConnected)
            uBit.serial.printf("%s", dataPiece);
#ifdef ENABLE_BLUETOOTH           
        if (_leConnected) {
            if (LOG_TO_SERIAL_EX_2 && !_serialConnected) uBit.serial.printf("<%d(%d)~", uart->txBufferedSize(), dataPieceLen);
#ifdef ASYNC_LE_SEND            
            if ((uart->txBufferedSize() + dataPieceLen) > LeSendBufferSize/*uart->txBufferedSize() > LE_WAIT_SEND_BUFFER_SIZE*/) {
                if (LOG_TO_SERIAL_EX && !_serialConnected) uBit.serial.printf(". %d .", uart->txBufferedSize());
                waitForEvent(MICROBIT_ID_NOTIFY, MICROBIT_UART_S_EVT_TX_EMPTY);
                if (LOG_TO_SERIAL_EX && !_serialConnected) uBit.serial.printf(". %d", uart->txBufferedSize());
            }
            uart->send((const uint8_t*) dataPiece, dataPieceLen, ASYNC);
#else            
            uart->send((const uint8_t*) dataPiece, dataPieceLen);
#endif            
            if (LOG_TO_SERIAL_EX_2 && !_serialConnected) uBit.serial.printf("~%d>", uart->txBufferedSize());
        }
#endif       
    }

    void _sendData(const char *data, bool flush) {
        uint8_t len = strlen(data);
        uint8_t offset = 0;
        while (len > 0) {
            uint8_t copyLen;
            if (bufferOffset + len > BufferSize)
                copyLen = BufferSize - bufferOffset;
            else
                copyLen = len;
            strncpy(buffer + bufferOffset, data + offset, copyLen);
            bufferOffset += copyLen;
            buffer[bufferOffset] = '\0';
            offset += copyLen;
            len -= copyLen;
            if (len > 0 || flush) {
                __sendDataPiece(buffer, bufferOffset);
                bufferOffset = 0;
            }   
        }
    }
    bool _startSendCommand(const char *lid, const char *cmd) {
        if (LOG_TO_SERIAL_EX_2 && !_serialConnected) uBit.serial.printf("[%d^", _sender);
#ifdef NO_CONCURRENT_SEND_COMMAND
        if (_sender > 0) {
            uint8_t me_sender = _sender - 1;
            while (true) {
                if (LOG_TO_SERIAL_EX && !_serialConnected) uBit.serial.printf("> %d-%d >", _sender, me_sender);
                waitForEvent(MICROBIT_ID_NOTIFY, EVENT_SENT_COMMAND);
                if (LOG_TO_SERIAL_EX && !_serialConnected) uBit.serial.printf("> %d-%d", _sender, me_sender);
                if (_sender == me_sender)
                    break;
            }
        }
        if (_sender > 0) {
            if (LOG_TO_SERIAL && !_serialConnected)
                uBit.serial.printf("X%s.%s", lid, cmd);
            return false;
        }
#endif    
        if (LOG_TO_SERIAL && !_serialConnected)
            uBit.serial.printf("|");
        _sender++;
        _param_count = 0;
        if (lid != NULL) {
            _sendData(lid, false);
            _sendData(".", false);
        }
        _sendData(cmd, false);
        _sendData(":", false);
        return true;
    }
    void _endSendCommand() {
        _sendData("\n", true);
        _sender--;
       if (LOG_TO_SERIAL_EX_2 && !_serialConnected) uBit.serial.printf("^%d]", _sender);
#ifdef NO_CONCURRENT_SEND_COMMAND
        MicroBitEvent(MICROBIT_ID_NOTIFY, EVENT_SENT_COMMAND);
#endif
    }


    inline const char*_checkCmdIn(String _cmdIn) {
        const char* cmdIn = _cmdIn != NULL ? _cmdIn->getUTF8Data() : NULL; 
        if (cmdIn != NULL && cmdIn[0] == '\0')
            cmdIn = NULL;
        return cmdIn;
    }

    bool __sendCommand(const char *lid, const char *cmd, const char *param1, const char *param2, const char *param3, bool completed) {
        if (LOG_TO_SERIAL_EX_2 && !_serialConnected && false) {
            uBit.serial.printf("~%d~|%s.%s|%s|%s|%d--", _sender, lid, cmd, param1, param2, completed);
        }
        if (cmd != NULL) {
            if (!_startSendCommand(lid, cmd))
                return false;
        }
        if (_sender == 0)
            return false;
        if (param1 != NULL) {
            if (_param_count > 0)
                _sendData(",", false);
            _sendData(param1, false);
            _param_count++;
            if (param2 != NULL) {
                _sendData(",", false);  
                _sendData(param2, false);
                _param_count++;
                if (param3 != NULL) {
                    _sendData(",", false);  
                    _sendData(param3, false);
                    _param_count++;
                }
            }
        }
        if (completed)
            _endSendCommand();
        return true;
    }
    bool _sendCommand(String _lid, String _cmd, String _param1, String _param2, String _param3, bool completed) {
        const char *lid = _checkCmdIn(_lid);
        const char *cmd = _checkCmdIn(_cmd);
        const char *param1 = _checkCmdIn(_param1);
        const char *param2 =  _checkCmdIn(_param2);
        const char *param3 =  _checkCmdIn(_param3);
        return __sendCommand(lid, cmd, param1, param2, param3, completed);
    }    

    //%
    bool sendCommand0(String lid, String cmd) {
        return _sendCommand(lid, cmd, NULL, NULL, NULL, true);
    }

    //%
    bool sendCommand1(String lid, String cmd, String param) {
        return _sendCommand(lid, cmd, param, NULL, NULL, true);
    }

    //%
    bool sendCommand2(String lid, String cmd, String param1, String param2) {
        return _sendCommand(lid, cmd, param1, param2, NULL, true);
    }

    //%
    bool sendCommand3(String lid, String cmd, String param1, String param2, String param3) {
        return _sendCommand(lid, cmd, param1, param2, param3, true);
    }

    //%
    bool sendPartCommand0(String lid, String cmd) {
        return _sendCommand(lid, cmd, NULL, NULL, NULL, false);
    }

    //%
    bool sendPartCommand1(String lid, String cmd, String param) {
        return _sendCommand(lid, cmd, param, NULL, NULL, false);
    }

    //%
    bool sendPartCommand2(String lid, String cmd, String param1, String param2) {
        return _sendCommand(lid, cmd, param1, param2, NULL, false);
    }

    //%
    bool sendPartCommand3(String lid, String cmd, String param1, String param2, String param3) {
        return _sendCommand(lid, cmd, param1, param2, param3, false);
    }

    void _scanMbLedsToDims(String _leds, int& width, int& height) {
        const char* leds = _leds->getUTF8Data();
        int i = 0;
        int w = 0;
        int h = 0;
        int x = 0;
        if (leds[0] == '\n') {
            h--;
        }
        while (true) {
            char c = leds[i++];
            if (c == 0) {
                if (x > w)
                    w = x;
                h += (x > 0 ? 1 : 0);
                break;
            }
            if (c == '|' || c == '\n') {
                if (x > w)
                    w = x;
                h++;
                x = 0;
            } else if (c == '.' || c == '#') {
                x++;
            }
        }
        width = w;
        height = h;
        if (false) {
            uBit.serial.printf("// calc: %d, %d\n", width, height);
        }   
    }

    void _convertMbLedsToChars(String _leds, int width, char *buffer, int bufferSize) {
        const char* leds = _leds->getUTF8Data();
        for (int i = 0; i <= bufferSize; i++) {
            buffer[i] = 0;
        }
        int i = 0;
        int bi = 0;
        while (true) {
            char pc = i > 0 ? leds[i - 1] : '|';
            char c = leds[i++];
            if (c == 0 || bi == bufferSize)
                break;
            if (c == '.')
                buffer[bi++] = '0';
            else if (c == '#')
                buffer[bi++] = '1';
            else if (c == '|' && ((bi % width != 0) || pc == '|')) {
                int e = width - (bi % width);
                for (int j = 0; j < e; j++) {
                    buffer[bi++] = '0';
                }
            }
                
        }
    }
    void _convertMbLeds(String _leds, uint8_t *buffer) {
        const char* leds = _leds->getUTF8Data();
        for (int i = 0; i < 25; i++) {
            buffer[i] = 0;
        }
        int i = 0;
        int bi = 0;
        while (true) {
            char pc = i > 0 ? leds[i - 1] : '|';
            char c = leds[i++];
            if (c == 0 || bi == 25)
                break;
            if (c == '.')
                buffer[bi++] = 0;
            else if (c == '#')
                buffer[bi++] = 1;
            else if (c == '|' && ((bi % 5 != 0) || pc == '|'))
                bi += 5 - (bi % 5);
        }
    }

    //%
    bool sendPartCommandMbLeds(String leds, int w, int h) {
        if (LOG_TO_SERIAL && LOG_TO_SERIAL_LEDS)
            uBit.serial.printf("// sendPartCommandMbLeds -- [%s]\n", leds->getUTF8Data());
        int width = w;
        int height = h;
        if (width == -1 || height == -1) {
            _scanMbLedsToDims(leds, width, height);
        }
        if (false) {
            uBit.serial.printf("// send: %d, %d\n", width, height);
        }   
        int bufferSize = width * height;
        char buffer[bufferSize + 1/*26*/];
        _convertMbLedsToChars(leds, width, buffer, bufferSize);
        char wb[8];
        char hb[8];
        itoa(width, wb);
        itoa(height, hb);
        if (false) {
            uBit.serial.printf("// command: %s, %s, %s\n", wb, hb, buffer);
        }   
        return __sendCommand(NULL, NULL, wb, hb, buffer, false);
    }


    //%
    void mbShowLeds(/*pxt::ImageLiteral_*/String leds) {
        if (LOG_TO_SERIAL && LOG_TO_SERIAL_LEDS)
            uBit.serial.printf("// mbShowLeds -- [%s]\n", leds->getUTF8Data());
        uint8_t buffer[25];
        _convertMbLeds(leds, buffer);
        uBit.display.print(MicroBitImage(5, 5, buffer), 0, 0, 0, 400 /*interval*/);
    }

    void onLeConnected(MicroBitEvent) {
#ifdef ENABLE_SERIAL
        if (_serialConnected)
            return;
#endif
        if (LOG_TO_SERIAL)
            uBit.serial.printf("----\n");

        if (_onConnect != NULL) {
            runAction0(_onConnect);
        }

        _leConnected = true;
    }

    void onLeDisconnected(MicroBitEvent) {
#ifdef ENABLE_SERIAL
        if (_serialConnected)
            return;
#endif

        if (LOG_TO_SERIAL)
            uBit.serial.printf("xxxx\n");

        _leConnected = false;

        if (_onDisconnect != NULL) {
            runAction0(_onDisconnect);
        }
    }


    void onLeReceived(MicroBitEvent) {
        int bytes = uart->rxBufferedSize();
        if (bytes > 0) {
            ManagedString in = uart->read(bytes);
            if (LOG_TO_SERIAL) {
                uBit.serial.printf("// LE-READ: %s", in.toCharArray());
            }
            if (_onReceive != NULL && _leConnected) {
                runAction1(_onReceive, (TValue) mkString(in.toCharArray()));
            }
        }
    }

    void onSerialReceived(MicroBitEvent) {
        int bytes = uBit.serial.getRxBufferSize();
        if (bytes > 0) {
            ManagedString in = uBit.serial.read(bytes, MicroBitSerialMode::ASYNC);
            if (LOG_TO_SERIAL && !_serialConnected)
                uBit.serial.printf("// SERIAL-READ: %s", in.toCharArray());
            if (!_serialConnected && !_leConnected) {
                if (in == ManagedString("ddhello\n")) {
                    if (_onConnect != NULL) {
                        runAction0(_onConnect);
                    }
                    _serialConnected = true;
                }
                return;
            }
            if (_onReceive != NULL && _serialConnected) {
                runAction1(_onReceive, (TValue) mkString(in.toCharArray()));
            }
        }
    }


    //%
    void ddconnect() {
        uBit.serial.printf("ddhello\n");
    }

    //%
    void ddinit(int enableWhat, Action onConnect, Action onDisconnect, Action onReceive) {
        _onConnect = onConnect;
        _onDisconnect = onDisconnect;
        _onReceive = onReceive;

        bool enableBluetooth = (enableWhat & 1) != 0;
        bool enableSerial = (enableWhat & 2) != 0;

#ifdef ENABLE_BLUETOOTH      
        if (enableBluetooth) {     
            uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onLeConnected);
            uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onLeDisconnected);

            uart = new MicroBitUARTService(*uBit.ble, LeReceiveBufferSize, LeSendBufferSize);

            uBit.messageBus.listen(MICROBIT_ID_BLE_UART, MICROBIT_UART_S_EVT_DELIM_MATCH, onLeReceived);
            uart->eventOn(ManagedString("\n"));
        }
#endif

#ifdef ENABLE_SERIAL
        if (enableSerial) {
            uBit.messageBus.listen(MICROBIT_ID_SERIAL, MICROBIT_SERIAL_EVT_DELIM_MATCH, onSerialReceived);
            //uBit.serial.baud(SERIAL_BAUD_RATE);
            uBit.serial.eventOn(ManagedString("\n"));
            // lazy initialization of serial buffers
            uBit.serial.read(MicroBitSerialMode::ASYNC);
            uBit.serial.setTxBufferSize(SerialSendBufferSize);
            uBit.serial.setRxBufferSize(SerialReceiveBufferSize);
        }
#endif

        if (LOG_TO_SERIAL)
            uBit.serial.printf("// !!! INITIALIZED !!!\n");
    }

}



