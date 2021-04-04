/*
Lesson Player
View your lessons, do not miss the mark.

Copyright (C) 2021  Vincenzo Padula

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

drop table if exists class;
drop table if exists lesson;
drop table if exists silence;

create table class (
  idclass int auto_increment not null primary key,
  name varchar(50) not null,
  professor varchar(50) not null,
  directory varchar(200) not null
);

create table lesson (
  idlesson int auto_increment not null primary key,
  idclass int not null references class(idclass),
  dated date not null,
  title varchar(40) not null,
  professor varchar(50) null,
  lastPlayed datetime null,
  mark float default 0,
  watched boolean default false,
  playbackRate float default 1,
  filename varchar(100) not null
);

create table silence (
  idlesson int not null references lesson(idlesson),
  t_start float not null,
  t_end float not null,
  primary key (idlesson, t_start)
);
