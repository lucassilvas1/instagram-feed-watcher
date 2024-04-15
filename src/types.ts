export interface NodeContainer {
  node: Node;
  cursor: string;
}

export interface Node {
  media: Post;
  ad: any;
  explore_story: any;
  end_of_feed_demarcator: any;
  stories_netego: any;
  suggested_users: any;
  bloks_netego: any;
  __typename: string;
}

export interface Post {
  id: string;
  owner: PostOwner;
  view_state_item_type: any;
  brs_severity: any;
  pk: string;
  code: string;
  inventory_source: string;
  explore: any;
  main_feed_carousel_starting_media_id: any;
  carousel_media?: CarouselMedia[];
  audience: any;
  is_seen: boolean;
  media_type: number;
  original_height: number;
  original_width: number;
  has_liked: boolean;
  media_overlay_info: any;
  user: User;
  carousel_parent_id: any;
  is_dash_eligible?: number;
  number_of_qualities?: number;
  video_dash_manifest?: string;
  video_versions?: VideoVersion[];
  clips_attribution_info: any;
  image_versions2: ImageVersions2;
  share_urls: any;
  product_type: string;
  can_viewer_reshare: boolean;
  ig_media_sharing_disabled: boolean;
  visibility: any;
  usertags?: Usertags;
  clips_metadata?: ClipsMetadata;
  feed_demotion_control: any;
  feed_recs_demotion_control: any;
  coauthor_producers?: CoauthorProducer[];
  comments_disabled: any;
  like_and_view_counts_disabled: boolean;
  photo_of_you?: boolean;
  location?: Location;
  top_likers: string[];
  facepile_top_likers: FacepileTopLiker[];
  like_count: number;
  view_count: any;
  social_context: SocialContext[];
  saved_collection_ids: any;
  has_viewer_saved: any;
  caption?: Caption;
  can_reshare: any;
  expiring_at: any;
  link: any;
  story_cta: any;
  taken_at: number;
  organic_tracking_token: string;
  logging_info_token: string;
  sharing_friction_info: SharingFrictionInfo;
  accessibility_caption?: string;
  invited_coauthor_producers: any[];
  carousel_media_count?: number;
  follow_hashtag_info: any;
  is_paid_partnership: boolean;
  affiliate_info: any;
  sponsor_tags: any;
  caption_is_edited: boolean;
  comments: Comment[];
  comment_count: number;
  commenting_disabled_for_viewer?: boolean;
  preview?: string;
  headline: any;
  can_see_insights_as_brand: boolean;
  boosted_status: any;
  boost_unavailable_identifier: any;
  boost_unavailable_reason: any;
  has_audio?: boolean;
}

export interface PostOwner {
  pk: string;
  id: string;
  username: string;
  profile_pic_url: string;
  is_private: boolean;
  show_account_transparency_details: boolean;
  __typename: string;
  is_embeds_disabled: any;
  is_unpublished: boolean;
  friendship_status: FriendshipStatus;
  supervision_info: any;
  full_name: string;
  is_verified: boolean;
  transparency_product: any;
  transparency_product_enabled: boolean;
  transparency_label: any;
}

export interface FriendshipStatus {
  following: boolean;
  blocking: any;
  is_feed_favorite: boolean;
  outgoing_request: any;
  followed_by: any;
  incoming_request: any;
  is_restricted: boolean;
  is_bestie: boolean;
}

export interface CarouselMedia {
  pk: string;
  id: string;
  original_height: number;
  original_width: number;
  media_type: number;
  carousel_parent_id: string;
  is_dash_eligible?: number;
  number_of_qualities?: number;
  video_dash_manifest?: string;
  video_versions?: VideoVersion[];
  link: any;
  story_cta: any;
  accessibility_caption?: string;
  image_versions2: ImageVersions2;
  usertags?: Usertags;
  media_overlay_info: any;
  carousel_media: any;
  headline: any;
  sharing_friction_info: SharingFrictionInfo;
  preview?: string;
  organic_tracking_token: any;
  has_audio?: boolean;
}

export interface VideoVersion {
  type: number;
  url: string;
  width: number;
  height: number;
}

export interface ImageVersions2 {
  candidates: Candidate[];
}

export interface Candidate {
  url: string;
  height: number;
  width: number;
}

export interface SharingFrictionInfo {
  bloks_app_url: any;
  should_have_sharing_friction: boolean;
}

export interface Usertags {
  in: {
    position: number[];
    user: TaggedUser;
  };
}

export interface TaggedUser {
  pk: string;
  full_name: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
  id: string;
}

export interface User {
  pk: string;
  id: string;
  username: string;
  is_unpublished: boolean;
  friendship_status: FriendshipStatus;
  __typename: string;
  supervision_info: any;
  is_private: boolean;
  profile_pic_url: string;
  is_verified: boolean;
  live_broadcast_visibility: any;
  live_broadcast_id: any;
  hd_profile_pic_url_info: {
    url: string;
  };
  full_name: string;
  is_embeds_disabled: any;
  latest_reel_media: number;
}

export interface ClipsMetadata {
  achievements_info: AchievementsInfo;
  music_info?: MusicInfo;
  original_sound_info?: OriginalSoundInfo;
}

export interface AchievementsInfo {
  show_achievements: boolean;
}

export interface MusicInfo {
  music_asset_info: MusicAssetInfo;
  music_consumption_info: MusicConsumptionInfo;
}

export interface MusicAssetInfo {
  audio_cluster_id: string;
  title: string;
  display_artist: string;
  is_explicit: boolean;
}

export interface MusicConsumptionInfo {
  should_mute_audio: boolean;
  should_mute_audio_reason: string;
  is_trending_in_clips: boolean;
}

export interface OriginalSoundInfo {
  audio_asset_id: string;
  original_audio_title: string;
  ig_artist: IgArtist;
  is_explicit: boolean;
  should_mute_audio: boolean;
  consumption_info: ConsumptionInfo;
}

export interface IgArtist {
  username: string;
  id: string;
}

export interface ConsumptionInfo {
  should_mute_audio_reason: string;
  is_trending_in_clips: boolean;
}

export interface CoauthorProducer {
  pk: string;
  id: string;
  is_unpublished: any;
  username: string;
  profile_pic_url: string;
  full_name: string;
  is_verified: boolean;
}

export interface Location {
  pk: number;
  lat?: number;
  lng?: number;
  name: string;
  profile_pic_url: any;
}

export interface FacepileTopLiker {
  profile_pic_url: string;
  id: string;
}

export interface SocialContext {
  social_context_type: string;
  social_context_users_count: number;
  social_context_facepile_users: SocialContextFacepileUser[];
  __typename: string;
}

export interface SocialContextFacepileUser {
  profile_pic_url: string;
  userID: string;
  username: string;
  id: string;
}

export interface Caption {
  text: string;
  pk: string;
  has_translation?: boolean;
}

export interface Comment {
  pk: string;
  child_comment_count: any;
  restricted_status: any;
  parent_comment_id: any;
  has_translation: any;
  user: CommentAuthor;
  has_liked_comment: boolean;
  text: string;
  created_at: number;
  comment_like_count: number;
  giphy_media_info: any;
  is_covered: boolean;
  __typename: string;
}

export interface CommentAuthor {
  pk: string;
  username: string;
  is_unpublished: any;
  profile_pic_url: string;
  id: string;
  is_verified: boolean;
  fbid_v2: string;
}