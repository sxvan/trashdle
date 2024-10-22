import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
})
export class AutocompleteComponent<T> implements OnInit {
  @Input() source$: Observable<T[]> = of([]);
  @Input() displayFn: (item: T) => string = (item) => String(item);
  @Input() filterSourceFn: (source: T[], value: string) => T[] = (
    source,
    value
  ) =>
    source.filter(
      (item) => this.displayFn(item).toLowerCase() === value.toLowerCase()
    );

  @Output() onItemSelected: EventEmitter<T> = new EventEmitter<T>();
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();

  @Input() buttonText: string = '';
  @Input() noResultsText: string = '';

  value: string = '';
  filteredSource: T[] = [];
  showAutocompleteResults: boolean = false;

  ngOnInit(): void {
    this.source$.subscribe((source) => {
      this.filteredSource = source;
    });
  }

  updateFilteredSource() {
    this.source$.subscribe(
      (source) =>
        (this.filteredSource = this.filterSourceFn(source, this.value))
    );
  }

  setValue(value: string) {
    this.value = value;
    this.updateFilteredSource();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest(
      '.autocomplete'
    );
    if (!clickedInside) {
      this.showAutocompleteResults = false;
    }
  }
}
