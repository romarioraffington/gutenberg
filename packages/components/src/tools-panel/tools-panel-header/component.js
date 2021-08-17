/**
 * WordPress dependencies
 */
import { check, moreHorizontal, plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DropdownMenu from '../../dropdown-menu';
import MenuGroup from '../../menu-group';
import MenuItem from '../../menu-item';
import { useToolsPanelHeader } from './hook';
import { contextConnect } from '../../ui/context';

const ToolsPanelHeader = ( props, forwardedRef ) => {
	const {
		hasMenuItems,
		header,
		menuItems,
		menuLabel,
		resetAll,
		toggleItem,
		...headerProps
	} = useToolsPanelHeader( props );

	if ( ! header ) {
		return null;
	}

	const menuItemsArray = Object.entries( menuItems );
	const icon = menuItemsArray.some( ( [ , isSelected ] ) => isSelected ) ? moreHorizontal : plus;

	return (
		<h2 { ...headerProps } ref={ forwardedRef }>
			{ header }
			{ hasMenuItems && (
				<DropdownMenu icon={ icon } label={ menuLabel }>
					{ ( { onClose } ) => (
						<>
							<MenuGroup label={ __( 'Display options' ) }>
								{ menuItemsArray.map(
									( [ label, isSelected ] ) => {
										return (
											<MenuItem
												key={ label }
												icon={ isSelected && check }
												isSelected={ isSelected }
												onClick={ () => {
													toggleItem( label );
													onClose();
												} }
												role="menuitemcheckbox"
											>
												{ label }
											</MenuItem>
										);
									}
								) }
							</MenuGroup>
							<MenuGroup>
								<MenuItem
									onClick={ () => {
										resetAll();
										onClose();
									} }
								>
									{ __( 'Reset all' ) }
								</MenuItem>
							</MenuGroup>
						</>
					) }
				</DropdownMenu>
			) }
		</h2>
	);
};

const ConnectedToolsPanelHeader = contextConnect(
	ToolsPanelHeader,
	'ToolsPanelHeader'
);

export default ConnectedToolsPanelHeader;
