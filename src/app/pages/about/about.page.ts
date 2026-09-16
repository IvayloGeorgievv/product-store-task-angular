import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-about',
  styleUrl: './about.page.css',
  templateUrl: './about.page.html',
})
export class AboutPage {
  protected readonly teamMembers: { name: string; role: string; icon: string }[] = [
    { name: 'John Doe', role: 'Lead Architect', icon: 'fa-user-tie' },
    { name: 'Jane Doe', role: 'UI/UX Designer', icon: 'fa-pen-nib' },
    { name: 'Someone', role: 'Frontend Engineer', icon: 'fa-code' },
  ];
}
