import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Constitution } from 'src/app/types/constitution';
import { Song } from 'src/app/types/song';
import { User } from 'src/app/types/user';
import { SongWindowComponent } from '../../../song-window/song-window.component';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete'
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'song-list-section',
  templateUrl: './song-list-section.component.html',
  styleUrls: ['./song-list-section.component.scss']
})
export class SongListSectionComponent implements OnInit {
  @Input() constitution: Constitution;
  @Input() users: User[];

  visible = true;
  selectable = true;
  removable = true;
  filterCtrl = new FormControl();
  filteredFilters: Observable<string[]>;
  filters: string[] = [];
  allFilters: string[] = [];

  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ngOnInit() {
    for (const user of this.users) {
      this.allFilters.push(user.displayName);
    }
  }

  constructor(private dialog: MatDialog) {
    this.filteredFilters = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) => filter ? this._filter(filter) : this.allFilters.slice()));
  }

  openDialogSong(song: Song): void {
    const dialogConfig = new MatDialogConfig;

    dialogConfig.data = {
      song: song,
      constitution: this.constitution,
    }

    dialogConfig.hasBackdrop = true;
    dialogConfig.maxWidth = '80%';
    dialogConfig.maxHeight = '60%';

    this.dialog.open(SongWindowComponent, dialogConfig);
  }

  sortDataSong(sort: Sort) {
    const data = this.constitution.songs.slice();
    if(!sort.active || sort.direction === '') {
      this.constitution.songs = data;
      return;
    }

    this.constitution.songs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case "id": return this.compare(a.id, b.id, isAsc);
        case "title": return this.compare(a.shortTitle, b.shortTitle, isAsc);
        case "author": return this.compare(a.author, b.author, isAsc);
        case "username": return this.compare(this.showDisplayName(a.patron), this.showDisplayName(b.patron), isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showDisplayName(uid: string): string {
    const user = this.users.find(x => x.uid === uid);
    if (user !== undefined) { return user.displayName; }
    return "";
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.filters.push(value.trim());
      console.log(value.trim())
      this.allFilters.splice(this.allFilters.findIndex(x => x === value.trim()), 1);
    }

    if (input) {
      input.value = '';
    }

    // this.filterCtrl.setValue(null);
  }

  remove(filter: string): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.viewValue);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFilters.filter(filter => filter.toLowerCase().indexOf(filterValue) === 0);
  }

}
