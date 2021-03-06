'use strict';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { dbVariables } from '../../db/dbVariables';
import { limitSubscription } from './rateLimit';
import { debug } from '../debug';

Meteor.methods({
  editAnnouncement(announcement, announcementDetail) {
    check(this.userId, String);
    check(announcement, String);
    check(announcementDetail, String);
    editAnnouncement(Meteor.user(), announcement, announcementDetail);

    return true;
  }
})
function editAnnouncement(user, announcement, announcementDetail) {
  debug.log('editAnnouncement', {user, announcement, announcementDetail});
  if (! user.profile.isAdmin) {
    throw new Meteor.Error(403, '您並非金融管理會委員，無法進行此操作！');
  }
  dbVariables.set('announcement', announcement);
  dbVariables.set('announcementDetail', announcementDetail);
}

Meteor.publish('announcementDetail', function () {
  debug.log('publish announcementDetail');

  return dbVariables.find(
    {
      _id: 'announcementDetail'
    },
    {
      disableOplog: true
    }
  );
});
//一分鐘最多重複訂閱5次
limitSubscription('announcementDetail', 5);
