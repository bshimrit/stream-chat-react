import React, { PureComponent, RefObject } from 'react';
import type {
  Channel,
  ChannelMemberResponse,
  MessageResponse,
  Mute,
} from 'stream-chat';
import type {
  LoadingIndicator,
  MessageProps,
  TranslationContextValue,
} from 'types';
import { v4 as uuidv4 } from 'uuid';
import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../../types/types';
import { useChannelContext, useTranslationContext } from '../../context';
import { smartRender } from '../../utils';
import { Attachment } from '../Attachment';
import { Avatar } from '../Avatar';
import { DateSeparator as DefaultDateSeparator } from '../DateSeparator';
import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';
import { EventComponent } from '../EventComponent';
import { LoadingIndicator as DefaultLoadingIndicator } from '../Loading';
import { MessageSimple } from '../Message';
import { defaultPinPermissions, MESSAGE_ACTIONS } from '../Message/utils';
import { TypingIndicator as DefaultTypingIndicator } from '../TypingIndicator';
import { Center } from './Center';
import { ConnectionStatus } from './ConnectionStatus';
import { CustomNotification } from './CustomNotification';
import { MessageListInner, MessageListInnerProps } from './MessageListInner';
import { MessageNotification } from './MessageNotification';

interface MessageListProps<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> extends MessageListInnerProps<At, Ch, Co, Ev, Me, Re, Us>,
    TranslationContextValue {
  /**
   * Additional props for underlying MessageInput component. We have instance of MessageInput
   * component in MessageSimple component, for handling edit state.
   * Available props - https://getstream.github.io/stream-chat-react/#messageinput
   * */
  additionalMessageInputProps: Record<string, unknown>;

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  Attachment: MessageProps<At, Ch, Co, Ev, Me, Re, Us>['Attachment'];
  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.js)
   * */
  Avatar: MessageProps<At, Ch, Co, Ev, Me, Re, Us>['Avatar'];

  channel: Channel<Ch>;
  /**
   * Date separator UI component to render
   *
   * Defaults to and accepts same props as: [DateSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/DateSeparator.js)
   */
  dateSeparator: MessageListInnerProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['DateSeparator'];

  /** Disables the injection of date separator components, defaults to false */
  disableDateSeparator: boolean;

  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message runs into error
   *
   * This function should accept following params:
   *
   */
  getFlagMessageErrorNotification: MessageProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['getFlagMessageErrorNotification'];
  /**
   * Function that returns message/text as string to be shown as notification, when request for flagging a message is successful
   *
   * This function should accept following params:
   *
   */
  getFlagMessageSuccessNotification: MessageProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['getFlagMessageSuccessNotification'];
  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user runs into error
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserErrorNotification: MessageProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['getMuteUserErrorNotification'];
  /**
   * Function that returns message/text as string to be shown as notification, when request for muting a user is successful
   *
   * This function should accept following params:
   *
   * @param user A user object which is being muted
   *
   * */
  getMuteUserSuccessNotification: MessageProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['getMuteUserSuccessNotification'];
  /**
   * Function that returns message/text as string to be shown as notification, when request for pinning a message runs into error
   *
   * This function should accept following params:
   *
   * @param message A [message object](https://getstream.io/chat/docs/#message_format)
   *
   * */
  getPinMessageErrorNotification: MessageProps<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['getPinMessageErrorNotification'];

  /**
   * Component to render at the top of the MessageList while loading new messages
   * */
  LoadingIndicator: typeof LoadingIndicator;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  members: {
    [user_id: string]: ChannelMemberResponse<Us>;
  };
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  Message: MessageProps<At, Ch, Co, Ev, Me, Re, Us>['Message'];
  /**
   * Array of allowed actions on message. e.g. ['edit', 'delete', 'flag', 'mute', 'react', 'reply']
   * If all the actions need to be disabled, empty array or false should be provided as value of prop.
   * */
  messageActions: unknown;
  /** Set the limit to use when paginating messages */
  messageLimit: number;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  messages: MessageResponse<At, Ch, Co, Me, Re, Us>[];

  mutes: Mute<Us>[];

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onMentionsClick: unknown;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  onMentionsHover: unknown;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  openThread: unknown;
  /**
   * The user roles allowed to pin messages in various channel types
   */
  pinPermissions: /** @type {PropTypes.Validator<import('types').PinPermissions>>} */ unknown;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  read: never;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  removeMessage: unknown;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  retrySendMessage: unknown;
  /**
   * Boolean weather current message list is a thread.
   */
  threadList: boolean;
  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML: boolean;
  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  updateMessage: MessageProps<At, Ch, Co, Ev, Me, Re, Us>['updateMessage'];

  /** **Available from [channel context](https://getstream.github.io/stream-chat-react/#channel)** */
  watchers: unknown;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMore?(messageLimit?: number | undefined): Promise<number>;
}

type Snapshot = { offsetBottom: number; offsetTop: number } | null;

/**
 * MessageList - The message list components renders a list of messages. Its a consumer of [Channel Context](https://getstream.github.io/stream-chat-react/#channel)
 *
 * @example ../../docs/MessageList.md
 */
class MessageListWithoutContext<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> extends PureComponent<
  MessageListProps<At, Ch, Co, Ev, Me, Re, Us>,
  {
    newMessagesNotification: boolean;
    notifications: Array<{
      id: string;
      text: string;
      type: 'success' | 'error';
    }>;
    messageListRect?: DOMRect;
  }
> {
  static defaultProps = {
    Attachment,
    Avatar,
    DateSeparator: DefaultDateSeparator,
    EmptyStateIndicator: DefaultEmptyStateIndicator,
    LoadingIndicator: DefaultLoadingIndicator,
    Message: MessageSimple,
    messageActions: Object.keys(MESSAGE_ACTIONS),
    MessageSystem: EventComponent,
    noGroupByUser: false,
    pinPermissions: defaultPinPermissions,
    threadList: false,
    TypingIndicator: DefaultTypingIndicator,
    unsafeHTML: false,
  };

  bottomRef: RefObject<HTMLDivElement>;
  messageList: RefObject<HTMLDivElement>;
  notificationTimeouts: Array<NodeJS.Timeout>;
  closeToTop: boolean | undefined;
  scrollOffset: number | undefined;

  constructor(props: MessageListProps<At, Ch, Co, Ev, Me, Re, Us>) {
    super(props);

    this.state = {
      newMessagesNotification: false,
      notifications: [],
    };

    this.bottomRef = React.createRef();
    this.messageList = React.createRef();
    this.notificationTimeouts = [];
  }

  componentDidMount() {
    // start at the bottom
    this.scrollToBottom();
    const messageListRect = this.messageList.current?.getBoundingClientRect();

    this.setState({
      messageListRect,
    });
  }

  componentWillUnmount() {
    this.notificationTimeouts.forEach(clearTimeout);
  }

  getSnapshotBeforeUpdate(
    prevProps: MessageListProps<At, Ch, Co, Ev, Me, Re, Us>,
  ) {
    if (this.props.threadList) {
      return null;
    }
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.

    if (prevProps.messages.length < this.props.messages.length) {
      const list = this.messageList.current;
      if (list) {
        return {
          offsetBottom: list.scrollHeight - list.scrollTop,
          offsetTop: list.scrollTop,
        };
      } else {
        return null;
      }
    }
    return null;
  }

  componentDidUpdate(
    prevProps: MessageListProps<At, Ch, Co, Ev, Me, Re, Us>,
    _: unknown,
    snapshot: Snapshot,
  ) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    const userScrolledUp = this.userScrolledUp();
    const currentLastMessage = this.props.messages[
      this.props.messages.length - 1
    ];
    const previousLastMessage =
      prevProps.messages[prevProps.messages.length - 1];
    if (!previousLastMessage || !currentLastMessage) {
      return;
    }

    const hasNewMessage = currentLastMessage.id !== previousLastMessage.id;
    const isOwner = currentLastMessage?.user?.id === this.props.client.userID;

    const list = this.messageList.current;

    // always scroll down when it's your own message that you added...
    const scrollToBottom = hasNewMessage && (isOwner || !userScrolledUp);

    if (scrollToBottom) {
      this.scrollToBottom();

      // remove the scroll notification if we already scrolled down...
      if (this.state.newMessagesNotification)
        this.setState({ newMessagesNotification: false });

      return;
    }

    if (snapshot !== null) {
      // Maintain the offsetTop of scroll so that content in viewport doesn't move.
      // This is for the case where user has scroll up significantly and a new message arrives from someone.
      if (hasNewMessage) {
        if (this.messageList.current) {
          this.scrollToTarget(snapshot.offsetTop, this.messageList.current);
        }
      } else {
        // Maintain the bottomOffset of scroll.
        // This is for the case of pagination, when more messages get loaded.
        if (this.messageList.current) {
          this.scrollToTarget(
            (list?.scrollHeight || 0) - snapshot.offsetBottom,
            this.messageList.current,
          );
        }
      }
    }

    // Check the scroll position... if you're scrolled up show a little notification
    if (hasNewMessage && !this.state.newMessagesNotification) {
      this.setState({ newMessagesNotification: true });
    }
  }

  scrollToBottom = () => {
    this._scrollToRef(this.bottomRef, this.messageList);
  };

  _scrollToRef = (
    el: RefObject<HTMLElement>,
    parent: RefObject<HTMLElement>,
  ) => {
    const scrollDown = () => {
      if (el && el.current && parent && parent.current) {
        this.scrollToTarget(el.current, parent.current);
      }
    };

    scrollDown();
    // scroll down after images load again
    setTimeout(scrollDown, 200);
  };

  /**
   * target - target to scroll to (DOM element, scrollTop Number, 'top', or 'bottom'
   * containerEl - DOM element for the container with scrollbars
   * source: https://stackoverflow.com/a/48429314
   */
  scrollToTarget = (
    target: HTMLElement | number | 'top' | 'bottom',
    containerEl: HTMLElement,
  ) => {
    //@ts-expect-error
    const isElement = target && target.nodeType === 1;
    const isNumber =
      Object.prototype.toString.call(target) === '[object Number]';

    let scrollTop;
    //@ts-expect-error
    if (isElement) scrollTop = target.offsetTop;
    else if (isNumber) scrollTop = target;
    else if (target === 'top') scrollTop = 0;
    else if (target === 'bottom')
      scrollTop = containerEl.scrollHeight - containerEl.offsetHeight;

    if (scrollTop !== undefined) containerEl.scrollTop = scrollTop; // eslint-disable-line no-param-reassign
  };

  goToNewMessages = () => {
    this.scrollToBottom();
    this.setState({ newMessagesNotification: false });
  };

  userScrolledUp = () => (this.scrollOffset || 0) > 200;

  listenToScroll = (
    offset: number,
    reverseOffset: number,
    threshold: number,
  ) => {
    this.scrollOffset = offset;
    this.closeToTop = reverseOffset < threshold;
    if (this.state.newMessagesNotification && !this.userScrolledUp()) {
      this.setState({ newMessagesNotification: false });
    }
  };

  /**
   * Adds a temporary notification to message list.
   * Notification will be removed after 5 seconds.
   *
   * @param notificationText  Text of notification to be added
   * @param type              Type of notification. success | error
   */
  addNotification = (notificationText: string, type: 'success' | 'error') => {
    if (typeof notificationText !== 'string') return;
    if (type !== 'success' && type !== 'error') return;

    const id = uuidv4();

    this.setState(({ notifications }) => ({
      notifications: [...notifications, { id, text: notificationText, type }],
    }));

    // remove the notification after 5000 ms
    const ct = setTimeout(
      () =>
        this.setState(({ notifications }) => ({
          notifications: notifications.filter((n) => n.id !== id),
        })),
      5000,
    );

    this.notificationTimeouts.push(ct);
  };

  onMessageLoadCaptured = () => {
    // A load event (emitted by e.g. an <img>) was captured on a message.
    // In some cases, the loaded asset is larger than the placeholder, which means we have to scroll down.
    if (!this.userScrolledUp() && !this.closeToTop) {
      this.scrollToBottom();
    }
  };

  loadMore = () => {
    if (this.props.loadMore) {
      if (this.props.messageLimit) {
        this.props.loadMore(this.props.messageLimit);
      } else {
        this.props.loadMore();
      }
    }
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div
          className={`str-chat__list ${
            this.props.threadList ? 'str-chat__list--thread' : ''
          }`}
          ref={this.messageList}
        >
          <MessageListInner<At, Ch, Co, Ev, Me, Re, Us>
            bottomRef={this.bottomRef}
            channel={this.props.channel}
            client={this.props.client}
            DateSeparator={this.props.DateSeparator || this.props.dateSeparator}
            disableDateSeparator={this.props.disableDateSeparator}
            EmptyStateIndicator={this.props.EmptyStateIndicator}
            HeaderComponent={this.props.HeaderComponent}
            headerPosition={this.props.headerPosition}
            hideDeletedMessages={this.props.hideDeletedMessages}
            internalInfiniteScrollProps={{
              hasMore: this.props.hasMore,
              isLoading: this.props.loadingMore,
              listenToScroll: this.listenToScroll,
              loader: (
                <Center key='loadingindicator'>
                  {smartRender(this.props.LoadingIndicator, { size: 20 }, null)}
                </Center>
              ),
              loadMore: this.loadMore,
            }}
            internalMessageProps={{
              additionalMessageInputProps: this.props
                .additionalMessageInputProps,
              addNotification: this.addNotification,
              Attachment: this.props.Attachment,
              Avatar: this.props.Avatar,
              //@ts-expect-error
              channel: this.props.channel,
              getFlagMessageErrorNotification: this.props
                .getFlagMessageErrorNotification,
              getFlagMessageSuccessNotification: this.props
                .getFlagMessageSuccessNotification,
              getMuteUserErrorNotification: this.props
                .getMuteUserErrorNotification,
              getMuteUserSuccessNotification: this.props
                .getMuteUserSuccessNotification,
              getPinMessageErrorNotification: this.props
                .getPinMessageErrorNotification,
              members: this.props.members,
              Message: this.props.Message,
              messageActions: this.props.messageActions,
              messageListRect: this.state.messageListRect,
              mutes: this.props.mutes,
              onMentionsClick: this.props.onMentionsClick,
              onMentionsHover: this.props.onMentionsHover,
              openThread: this.props.openThread,
              pinPermissions: this.props.pinPermissions,
              removeMessage: this.props.removeMessage,
              retrySendMessage: this.props.retrySendMessage,
              unsafeHTML: this.props.unsafeHTML,
              updateMessage: this.props.updateMessage,
              watchers: this.props.watchers,
            }}
            messages={this.props.messages}
            MessageSystem={this.props.MessageSystem}
            noGroupByUser={this.props.noGroupByUser}
            onMessageLoadCaptured={this.onMessageLoadCaptured}
            read={this.props.read}
            threadList={this.props.threadList}
            TypingIndicator={this.props.TypingIndicator}
          />
        </div>
        <div className='str-chat__list-notifications'>
          {this.state.notifications.map((notification) => (
            <CustomNotification
              active={true}
              key={notification.id}
              type={notification.type}
            >
              {notification.text}
            </CustomNotification>
          ))}
          <ConnectionStatus />
          <MessageNotification
            onClick={this.goToNewMessages}
            showNotification={this.state.newMessagesNotification}
          >
            {t && t('New Messages!')}
          </MessageNotification>
        </div>
      </React.Fragment>
    );
  }
}

export const MessageList = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: MessageListProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { typing, ...channelContext } = useChannelContext<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >();
  const translation = useTranslationContext();

  return (
    //@ts-expect-error
    <MessageListWithoutContext<At, Ch, Co, Ev, Me, Re, Us>
      {...channelContext}
      {...props}
      {...translation}
    />
  );
};
