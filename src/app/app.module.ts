import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddfriendComponent } from './components/addfriend/addfriend.component';
import { RequestsComponent } from './components/requests/requests.component';
import { MyfriendsComponent } from './components/myfriends/myfriends.component';
import { ChatFeedComponent } from './components/chat-feed/chat-feed.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ActivityComponent } from './components/activity/activity.component';
import { FriendInfoComponent } from './components/friend-info/friend-info.component';
import { MygroupsComponent } from './components/mygroups/mygroups.component';
import { GroupMenuComponent } from './components/group-menu/group-menu.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { RemoveMemberComponent } from './components/remove-member/remove-member.component';
import { GroupChatFeedComponent } from './components/group-chat-feed/group-chat-feed.component';
import { GroupFooterComponent } from './components/group-footer/group-footer.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

// Firebase & AngularFire2
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';

// firebaseconfig
import {environment} from '../environments/environment';

// Material
import { MaterialdesignModule } from './materialdesign';
import { FlexLayoutModule } from '@angular/flex-layout';

// Services
import { AuthService } from './services/auth.service';
import { AuthguardService } from './services/authguard.service';
import { UserService } from './services/user.service';
import { RequestsService } from './services/requests.service';
import { FriendsService } from './services/friends.service';
import { MessagesService } from './services/messages.service';
import { GroupsService } from './services/groups.service';

// Pipes
import { SmartDatePipe } from './pipes/smart-date.pipe';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { ScrollableDirective } from './directives/scrollable.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    DashboardComponent,
    NavBarComponent,
    SidebarComponent,
    ProfileComponent,
    AddfriendComponent,
    RequestsComponent,
    MyfriendsComponent,
    ChatFeedComponent,
    FooterComponent,
    SmartDatePipe,
    RelativeDatePipe,
    LoadingSpinnerComponent,
    ScrollableDirective,
    ActivityComponent,
    FriendInfoComponent,
    MygroupsComponent,
    GroupMenuComponent,
    AddMemberComponent,
    GroupInfoComponent,
    RemoveMemberComponent,
    GroupChatFeedComponent,
    GroupFooterComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialdesignModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  entryComponents: [
    LoadingSpinnerComponent,
    AddMemberComponent,
    GroupInfoComponent,
    RemoveMemberComponent
  ],
  providers: [
    AuthService,
    AuthguardService,
    UserService,
    RequestsService,
    FriendsService,
    MessagesService,
    GroupsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
