import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface MoviesItem {
  name: string;
  id: number;
  genre:string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: MoviesItem[] = [
  {id: 1, name: 'The Departed',genre:'Crime'},
  {id: 2, name: 'The Terminal',genre:'Drama'},
  {id: 3, name: 'Batman - The Dark Knight',genre:'Superhero'},
  {id: 4, name: 'The Matrix',genre:'SciFi'},
  {id: 5, name: 'The Lincoln Lawyer',genre:'Crime'},
  {id: 6, name: 'The Social Network',genre:'Drama'},
  {id: 7, name: 'Se7en',genre:'Thriller'},
  {id: 8, name: 'Gladiator',genre:'Fantasy'},
  {id: 9, name: 'Back to the Future',genre:'SciFi'},
  {id: 10, name: 'Avengers Infinity War',genre:'Superhero'}
];

/**
 * Data source for the Movies view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MoviesDataSource extends DataSource<MoviesItem> {
  data: MoviesItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MoviesItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: MoviesItem[]): MoviesItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: MoviesItem[]): MoviesItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'genre': return compare(a.genre, b.genre, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
